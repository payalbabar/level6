#![cfg(test)]
use super::{GasChainContract, GasChainContractClient, BookingStatus, CylinderMetadata};
use soroban_sdk::{Env, Address, String, Vec, testutils::Address as _};

#[test]
fn test_enterprise_protocol_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, GasChainContract);
    let client = GasChainContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let authority = Address::generate(&env);
    let user = Address::generate(&env);
    let distributor = Address::generate(&env);

    // 1. Initialize with Admin and Subsidy Authority
    client.init(&admin, &authority);

    // 2. Batch Add Distributors
    let mut dists = Vec::new(&env);
    dists.push_back(distributor.clone());
    client.batch_add_distributors(&admin, &dists);

    // 3. Register a physical cylinder (SN: L-102)
    let sn = String::from_str(&env, "L-102");
    let meta = CylinderMetadata {
        last_inspection: 1713800000,
        weight_kg: 14,
        is_active: true,
    };
    client.register_cylinder(&distributor, &sn, &meta);

    // 4. Register User Profile
    client.register_user(&user, &String::from_str(&env, "Paras"), &String::from_str(&env, "+123"), &true);

    // 5. Book Cylinder using the specific SN
    let booking_id = client.book_cylinder(&user, &distributor, &sn);
    assert_eq!(booking_id, 1);

    // 6. Verify Cylinder state (should be inactive while booking is pending)
    let cyl = client.get_cylinder(&sn);
    assert!(!cyl.is_active);

    // 7. Progress to Delivered (Status: 3)
    client.update_status(&distributor, &booking_id, &1); // Confirmed
    client.update_status(&distributor, &booking_id, &2); // OutForDelivery
    client.update_status(&distributor, &booking_id, &3); // Delivered

    // 8. Authority settles subsidy (Amount: 500 units)
    client.settle_subsidy(&authority, &booking_id, &500);

    // 9. Final Validation
    let booking = client.get_booking(&booking_id);
    assert_eq!(booking.status, BookingStatus::Subsidized);
    assert_eq!(booking.subsidy_amount, 500);
}
