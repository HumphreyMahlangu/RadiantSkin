package ac.za.mycput.service;

import ac.za.mycput.domain.Customer;
import ac.za.mycput.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ac.za.mycput.domain.Role;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;

@Service
public class CustomerService implements ICustomerService {

    private static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder(12);
    private final CustomerRepository repo;

    @Autowired
    public CustomerService(CustomerRepository repo) {
        this.repo = repo;
    }

    @Override
    public Customer create(Customer customer) {
        return register(customer);
    }

    @Override
    public Customer register(Customer customer) {
        if (customer == null || customer.getFirstName() == null || customer.getFirstName().isBlank()
                || customer.getLastName() == null || customer.getLastName().isBlank()
                || customer.getEmail() == null || customer.getEmail().isBlank()
                || customer.getPhoneNumber() == null || customer.getPhoneNumber().isBlank()
                || customer.getPassword() == null || customer.getPassword().length() < 8) {
            throw new IllegalArgumentException("Complete all fields and use a password of at least 8 characters");
        }

        customer.setFirstName(customer.getFirstName().trim());
        customer.setLastName(customer.getLastName().trim());
        customer.setEmail(customer.getEmail().trim().toLowerCase(Locale.ROOT));
        customer.setPhoneNumber(customer.getPhoneNumber().trim());
        if (!customer.getEmail().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
                || customer.getPassword().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("Enter a valid email and a password of no more than 72 bytes");
        }
        if (this.repo.findByEmail(customer.getEmail()) != null) {
            throw new IllegalArgumentException("This email is already registered");
        }

        customer.setUserId(null);
        customer.setPassword(PASSWORD_ENCODER.encode(customer.getPassword()));
        customer.setRole(Role.CUSTOMER);
        return this.repo.save(customer);
    }

    @Override
    public Customer login(String email, String password) {
        Customer customer = email == null ? null : this.repo.findByEmail(email.trim().toLowerCase(Locale.ROOT));

        if (customer == null) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String storedPassword = customer.getPassword();
        if (storedPassword == null || password == null) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (storedPassword.matches("^\\$2[aby]\\$\\d{2}\\$.*")) {
            if (!PASSWORD_ENCODER.matches(password, storedPassword)) {
                throw new IllegalArgumentException("Invalid email or password");
            }
        } else {
            if (!storedPassword.equals(password)) {
                throw new IllegalArgumentException("Invalid email or password");
            }
            customer.setPassword(PASSWORD_ENCODER.encode(password));
            repo.save(customer);
        }

        return customer;
    }

    @Override
    public Customer read(Long id) {
        return this.repo.findById(id).orElse(null);
    }

    @Override
    public Customer update(Customer customer) {
        if (customer.getUserId() != null) {
            Customer existing = repo.findById(customer.getUserId()).orElse(null);
            if (existing != null && (customer.getPassword() == null || customer.getPassword().isBlank())) {
                customer.setPassword(existing.getPassword());
            }
        }
        if (customer.getPassword() != null && !customer.getPassword().matches("^\\$2[aby]\\$\\d{2}\\$.*")) {
            customer.setPassword(PASSWORD_ENCODER.encode(customer.getPassword()));
        }
        return this.repo.save(customer);
    }

    @Override
    public boolean delete(Long id) {
        this.repo.deleteById(id);
        return true;
    }

    @Override
    public List<Customer> getAll() {
        return this.repo.findAll();
    }

    @Override
    public Customer findByEmail(String email) {
        return this.repo.findByEmail(email);
    }

    @Override
    public List<Customer> findByPhoneNumber(String phoneNumber) {
        return this.repo.findByPhoneNumber(phoneNumber);
    }
}
