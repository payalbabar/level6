#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec,
};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Distributor(Address),
    User(Address),
    Booking(u64),
    BookingCount,
    Cylinder(String),           // Tracking by unique Serial Number
    EmergencyStop,
    SubsidyAuthority,           // Gov agency address
}

#[derive(Clone, Copy, Debug, PartialEq)]
#[contracttype]
pub enum BookingStatus {
    Pending = 0,
    Confirmed = 1,
    OutForDelivery = 2,
    Delivered = 3,
    Cancelled = 4,
    Subsidized = 5,             // New production state
}

#[derive(Clone)]
#[contracttype]
pub struct Booking {
    pub id: u64,
    pub user: Address,
    pub distributor: Address,
    pub status: BookingStatus,
    pub timestamp: u64,
    pub cylinder_sn: String,    // Linked to a physical asset
    pub subsidy_amount: u64,    // In on-chain units
}

#[derive(Clone)]
#[contracttype]
pub struct UserProfile {
    pub name: String,
    pub contact: String,
    pub is_eligible_for_subsidy: bool,
}

#[derive(Clone)]
#[contracttype]
pub struct CylinderMetadata {
    pub last_inspection: u64,
    pub weight_kg: u32,
    pub is_active: bool,
}

#[contract]
pub struct GasChainContract;

#[contractimpl]
impl GasChainContract {
    /// Initialize the contract with an admin and subsidy authority
    pub fn init(env: Env, admin: Address, subsidy_authority: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::SubsidyAuthority, &subsidy_authority);
        env.storage().instance().set(&DataKey::EmergencyStop, &false);
        
        // Extend TTL to ensure persistent storage doesn't expire too soon in production
        env.storage().instance().extend_ttl(50000, 100000);
    }

    /// Circuit Breaker: Toggle contract operations in case of vulnerability detection
    pub fn toggle_emergency_stop(env: Env, admin: Address, state: bool) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        assert_eq!(admin, stored_admin, "Unauthorized");
        env.storage().instance().set(&DataKey::EmergencyStop, &state);
    }

    /// Enterprise Dashboard: Add multiple distributors in a single transaction
    pub fn batch_add_distributors(env: Env, admin: Address, distributors: Vec<Address>) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        assert_eq!(admin, stored_admin, "Unauthorized");

        for dist in distributors.iter() {
            env.storage().persistent().set(&DataKey::Distributor(dist.clone()), &true);
            env.storage().persistent().extend_ttl(&DataKey::Distributor(dist.clone()), 20000, 40000);
        }
    }

    /// Track a new physical LPG cylinder unit
    pub fn register_cylinder(env: Env, distributor: Address, sn: String, metadata: CylinderMetadata) {
        distributor.require_auth();
        assert!(!env.storage().instance().get(&DataKey::EmergencyStop).unwrap_or(false), "System Paused");
        
        if env.storage().persistent().has(&DataKey::Cylinder(sn.clone())) {
            panic!("Cylinder already registered");
        }

        env.storage().persistent().set(&DataKey::Cylinder(sn.clone()), &metadata);
        
        env.events().publish(
            (symbol_short!("cylinder"), symbol_short!("reg")),
            (sn, distributor),
        );
    }

    /// Register a user profile with subsidy eligibility check
    pub fn register_user(env: Env, user: Address, name: String, contact: String, is_eligible: bool) {
        user.require_auth();
        let profile = UserProfile { name, contact, is_eligible_for_subsidy: is_eligible };
        env.storage().persistent().set(&DataKey::User(user.clone()), &profile);
        env.storage().persistent().extend_ttl(&DataKey::User(user), 10000, 20000);
    }

    /// Book a cylinder with production-grade validation
    pub fn book_cylinder(env: Env, user: Address, distributor: Address, cylinder_sn: String) -> u64 {
        user.require_auth();
        assert!(!env.storage().instance().get(&DataKey::EmergencyStop).unwrap_or(false), "System Paused");
        
        // 1. Verify Distributor
        if !env.storage().persistent().has(&DataKey::Distributor(distributor.clone())) {
            panic!("Invalid distributor endpoint");
        }

        // 2. Verify Cylinder Availability
        let mut cylinder: CylinderMetadata = env.storage().persistent()
            .get(&DataKey::Cylinder(cylinder_sn.clone()))
            .expect("Asset not found in registry");
        
        assert!(cylinder.is_active, "Cylinder decommissioned or in maintenance");

        // 3. Handle Counter
        let mut count: u64 = env.storage().instance().get(&DataKey::BookingCount).unwrap_or(0);
        count += 1;

        let booking = Booking {
            id: count,
            user: user.clone(),
            distributor: distributor.clone(),
            status: BookingStatus::Pending,
            timestamp: env.ledger().timestamp(),
            cylinder_sn: cylinder_sn.clone(),
            subsidy_amount: 0,
        };

        // 4. Mark cylinder as in-use/pending
        cylinder.is_active = false; 
        env.storage().persistent().set(&DataKey::Cylinder(cylinder_sn), &cylinder);

        env.storage().persistent().set(&DataKey::Booking(count), &booking);
        env.storage().instance().set(&DataKey::BookingCount, &count);

        // Emit Enterprise Event
        env.events().publish(
            (symbol_short!("booking"), count),
            (user, distributor, symbol_short!("pending")),
        );

        count
    }

    /// Settlement: Subsidy authority approves and settles the payout
    pub fn settle_subsidy(env: Env, authority: Address, booking_id: u64, amount: u64) {
        authority.require_auth();
        let stored_auth: Address = env.storage().instance().get(&DataKey::SubsidyAuthority).expect("Auth not set");
        assert_eq!(authority, stored_auth, "Unauthorized authority");

        let mut booking: Booking = env.storage().persistent().get(&DataKey::Booking(booking_id)).expect("Booking not found");
        
        assert!(booking.status == BookingStatus::Delivered, "Cannot subsidize undelivered cylinder");
        
        booking.subsidy_amount = amount;
        booking.status = BookingStatus::Subsidized;

        env.storage().persistent().set(&DataKey::Booking(booking_id), &booking);

        env.events().publish(
            (symbol_short!("subsidy"), booking_id),
            (amount, symbol_short!("settled")),
        );
    }

    /// Update booking status with logistics tracking
    pub fn update_status(env: Env, distributor: Address, booking_id: u64, status: i32) {
        distributor.require_auth();

        let mut booking: Booking = env.storage().persistent().get(&DataKey::Booking(booking_id)).expect("Booking not found");
        assert_eq!(booking.distributor, distributor, "Unauthorized logistics partner");

        let new_status = match status {
            1 => BookingStatus::Confirmed,
            2 => BookingStatus::OutForDelivery,
            3 => BookingStatus::Delivered,
            4 => {
                // Re-activate cylinder on cancellation
                let mut cyl: CylinderMetadata = env.storage().persistent().get(&DataKey::Cylinder(booking.cylinder_sn.clone())).unwrap();
                cyl.is_active = true;
                env.storage().persistent().set(&DataKey::Cylinder(booking.cylinder_sn.clone()), &cyl);
                BookingStatus::Cancelled
            },
            _ => panic!("Invalid status Transition"),
        };

        booking.status = new_status;
        env.storage().persistent().set(&DataKey::Booking(booking_id), &booking);

        env.events().publish(
            (symbol_short!("status"), booking_id),
            (booking.status,),
        );
    }

    /* --- Public Views --- */

    pub fn get_booking(env: Env, booking_id: u64) -> Booking {
        env.storage().persistent().get(&DataKey::Booking(booking_id)).expect("NotFound")
    }

    pub fn get_cylinder(env: Env, sn: String) -> CylinderMetadata {
        env.storage().persistent().get(&DataKey::Cylinder(sn)).expect("NotFound")
    }
}

mod test;
