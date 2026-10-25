package ac.za.mycput.service;

import ac.za.mycput.domain.Customer;
import ac.za.mycput.domain.Role;
import ac.za.mycput.repository.CustomerRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerRegistrationTest {

    @Mock
    private CustomerRepository repo;

    @InjectMocks
    private CustomerService service;

    private Customer customer(String password) {
        Customer customer = new Customer();
        customer.setUserId(99L);
        customer.setFirstName("  Sam  ");
        customer.setLastName("  Mokoena  ");
        customer.setEmail("  SAM@example.com  ");
        customer.setPhoneNumber("  0712345678  ");
        customer.setPassword(password);
        customer.setRole(Role.ADMIN);
        return customer;
    }

    @Test
    void registrationHashesPasswordAndIgnoresClientIdentityFields() {
        when(repo.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Customer saved = service.register(customer("StrongPass123"));

        assertNull(saved.getUserId());
        assertEquals("Sam", saved.getFirstName());
        assertEquals("sam@example.com", saved.getEmail());
        assertEquals(Role.CUSTOMER, saved.getRole());
        assertFalse(saved.getPassword().equals("StrongPass123"));
        assertTrue(new BCryptPasswordEncoder().matches("StrongPass123", saved.getPassword()));
    }

    @Test
    void registrationDoesNotReturnPasswordInJson() throws Exception {
        Customer saved = customer("StrongPass123");
        ObjectMapper mapper = new ObjectMapper();

        String json = mapper.writeValueAsString(saved);

        assertFalse(json.contains("password"));
        Customer decoded = mapper.readValue("{\"firstName\":\"Sam\",\"password\":\"StrongPass123\"}", Customer.class);
        assertEquals("StrongPass123", decoded.getPassword());
    }

    @Test
    void rejectsDuplicateEmailAndWeakPassword() {
        when(repo.findByEmail("sam@example.com")).thenReturn(new Customer());
        assertThrows(IllegalArgumentException.class, () -> service.register(customer("StrongPass123")));
        assertThrows(IllegalArgumentException.class, () -> service.register(customer("short")));
        verify(repo, never()).save(any(Customer.class));
    }

    @Test
    void oldPlaintextAccountIsUpgradedOnSuccessfulLogin() {
        Customer existing = customer("OldPassword123");
        when(repo.findByEmail("sam@example.com")).thenReturn(existing);

        Customer signedIn = service.login("SAM@example.com", "OldPassword123");

        assertTrue(new BCryptPasswordEncoder().matches("OldPassword123", signedIn.getPassword()));
        verify(repo).save(existing);
    }

    @Test
    void updatingDetailsWithoutAPasswordKeepsTheExistingHash() {
        Customer existing = customer(new BCryptPasswordEncoder().encode("StrongPass123"));
        Customer update = customer(null);
        when(repo.findById(99L)).thenReturn(Optional.of(existing));
        when(repo.save(update)).thenReturn(update);

        Customer saved = service.update(update);

        assertEquals(existing.getPassword(), saved.getPassword());
    }
}
