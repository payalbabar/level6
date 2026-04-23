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
}

#[derive(Clone, Debug, PartialEq)]
#[contracttype]
pub enum BookingStatus {
    Pending = 0,
    Confirmed = 1,
    OutForDelivery = 2,
    Delivered = 3,
    Cancelled = 4,
}

#[derive(Clone)]
#[contracttype]
pub struct Booking {
    pub id: u64,
    pub user: Address,
    pub distributor: Address,
    pub status: BookingStatus,
    pub timestamp: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct UserProfile {
    pub name: String,
    pub contact: String,
}

#[contract]
pub struct GasChainContract;

#[contractimpl]
impl GasChainContract {
    /// Initialize the contract with an admin
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Add a new distributor (Admin only)
    pub fn add_distributor(env: Env, admin: Address, distributor: Address) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Only admin can add distributors");
        }
        env.storage().persistent().set(&DataKey::Distributor(distributor), &true);
    }

    /// Register a user profile
    pub fn register_user(env: Env, user: Address, name: String, contact: String) {
        user.require_auth();
        let profile = UserProfile { name, contact };
        env.storage().persistent().set(&DataKey::User(user), &profile);
    }

    /// Book a cylinder
    pub fn book_cylinder(env: Env, user: Address, distributor: Address) -> u64 {
        user.require_auth();
        
        // Verify distributor exists
        if !env.storage().persistent().has(&DataKey::Distributor(distributor.clone())) {
            panic!("Invalid distributor");
        }

        let mut count: u64 = env.storage().instance().get(&DataKey::BookingCount).unwrap_or(0);
        count += 1;

        let booking = Booking {
            id: count,
            user: user.clone(),
            distributor: distributor.clone(),
            status: BookingStatus::Pending,
            timestamp: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&DataKey::Booking(count), &booking);
        env.storage().instance().set(&DataKey::BookingCount, &count);

        // Emit event
        env.events().publish(
            (symbol_short!("booking"), count),
            (user, distributor, BookingStatus::Pending),
        );

        count
    }

    /// Update booking status (Distributor only)
    pub fn update_status(env: Env, distributor: Address, booking_id: u64, status: i32) {
        distributor.require_auth();

        // Verify distributor is authorized
        if !env.storage().persistent().has(&DataKey::Distributor(distributor.clone())) {
            panic!("Unauthorized distributor");
        }

        let mut booking: Booking = env.storage().persistent().get(&DataKey::Booking(booking_id)).expect("Booking not found");
        
        if booking.distributor != distributor {
            panic!("Not your booking");
        }

        let new_status = match status {
            1 => BookingStatus::Confirmed,
            2 => BookingStatus::OutForDelivery,
            3 => BookingStatus::Delivered,
            4 => BookingStatus::Cancelled,
            _ => panic!("Invalid status"),
        };

        booking.status = new_status.clone();
        env.storage().persistent().set(&DataKey::Booking(booking_id), &booking);

        // Emit event
        env.events().publish(
            (symbol_short!("status"), booking_id),
            (new_status,),
        );
    }

    /// Get booking details
    pub fn get_booking(env: Env, booking_id: u64) -> Booking {
        env.storage().persistent().get(&DataKey::Booking(booking_id)).expect("Booking not found")
    }

    /// Get user profile
    pub fn get_user(env: Env, user: Address) -> UserProfile {
        env.storage().persistent().get(&DataKey::User(user)).expect("User not found")
    }
}

mod test;
