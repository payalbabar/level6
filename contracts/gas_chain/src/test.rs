#![cfg(test)]
use super::{GasChainContract, GasChainContractClient, BookingStatus};
use soroban_sdk::{Env, Address, String, testutils::Address as _};

#[test]
fn test_gas_chain_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, GasChainContract);
    let client = GasChainContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let distributor = Address::generate(&env);

    // 1. Initialize
    client.init(&admin);

    // 2. Add Distributor
    client.add_distributor(&admin, &distributor);

    // 3. Register User
    client.register_user(&user, &String::from_str(&env, "Jane Doe"), &String::from_str(&env, "555-0199"));

    // 4. Book Cylinder
    let booking_id = client.book_cylinder(&user, &distributor);
    assert_eq!(booking_id, 1);

    // 5. Verify Booking
    let booking = client.get_booking(&booking_id);
    assert_eq!(booking.user, user);
    assert_eq!(booking.distributor, distributor);
    assert_eq!(booking.status, BookingStatus::Pending);

    // 6. Update Status (to Confirmed = 1)
    client.update_status(&distributor, &booking_id, &1);
    
    let updated_booking = client.get_booking(&booking_id);
    assert_eq!(updated_booking.status, BookingStatus::Confirmed);
}
