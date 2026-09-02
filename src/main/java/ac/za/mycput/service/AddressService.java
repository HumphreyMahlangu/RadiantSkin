package ac.za.mycput.service;

/*
/Name: Siphokazi Malingatshoni
/student no: 222868708
 */
import ac.za.mycput.domain.Address;
import ac.za.mycput.domain.Customer;
import ac.za.mycput.repository.AddressRepository;
import ac.za.mycput.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AddressService implements IAddressService {

    private final AddressRepository repository;
    private final CustomerRepository customerRepository;

    @Autowired
    public AddressService(AddressRepository repository, CustomerRepository customerRepository) {
        this.repository = repository;
        this.customerRepository = customerRepository;
    }

    @Override
    public Address create(Address address) {
        return repository.save(address);
    }

    @Override
    public Address read(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Address update(Address address) {
        return repository.save(address);
    }

    @Override
    public boolean delete(Long id) {
        repository.deleteById(id);
        return true;
    }

    @Override
    public List<Address> getAll() {
        return repository.findAll();
    }

    @Override
    public List<Address> findByCustomerId(Long customerId) {
        Customer customer = this.customerRepository.findById(customerId).orElse(null);

        if (customer == null) {
            return null;
        }

        return this.repository.findByCustomer(customer);
    }

    @Override
    public Address addAddress(Long customerId, String street, String city, String province, String postalCode, String country) {

        Customer customer = this.customerRepository.findById(customerId).orElse(null);

        if (customer == null) {
            throw new IllegalArgumentException("Customer not found");
        }

        Address address = new Address.Builder()
                .setCustomer(customer)
                .setStreet(street)
                .setCity(city)
                .setProvince(province)
                .setPostalCode(postalCode)
                .setCountry(country)
                .build();

        return this.repository.save(address);
    }
}