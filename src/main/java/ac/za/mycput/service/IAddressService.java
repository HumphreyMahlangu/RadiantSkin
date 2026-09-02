package ac.za.mycput.service;
/*
/Name: Siphokazi Malingatshoni
/Student Number: 222868708
 */
import ac.za.mycput.domain.Address;
import java.util.List;

public interface IAddressService extends IService<Address, Long> {

    List<Address> findByCustomerId(Long customerId);

    Address addAddress(Long customerId, String street, String city, String province, String postalCode, String country);
}

