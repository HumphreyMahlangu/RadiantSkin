package ac.za.mycput.controller;

import ac.za.mycput.domain.Admin;
import ac.za.mycput.domain.Customer;
import ac.za.mycput.domain.User;
import ac.za.mycput.service.AccountSession;
import ac.za.mycput.service.AdminService;
import ac.za.mycput.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Locale;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AdminService adminService;
    private final CustomerService customerService;
    private final AccountSession sessions;

    @Autowired
    public AuthController(AdminService adminService, CustomerService customerService, AccountSession sessions) {
        this.adminService = adminService;
        this.customerService = customerService;
        this.sessions = sessions;
    }

    public record Account(Long userId, String firstName, String lastName, String email,
                          String phoneNumber, String role) {
        static Account from(User user) {
            return new Account(user.getUserId(), user.getFirstName(), user.getLastName(), user.getEmail(),
                    user instanceof Customer customer ? customer.getPhoneNumber() : "",
                    user.getRole().name());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletRequest request) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
        email = email.trim().toLowerCase(Locale.ROOT);

        try {
            Admin admin = adminService.login(email, password);
            sessions.start(request, admin);
            return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(Account.from(admin));
        } catch (IllegalArgumentException adminFailed) {

        }

        try {
            Customer customer = customerService.login(email, password);
            sessions.start(request, customer);
            return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(Account.from(customer));
        } catch (IllegalArgumentException customerFailed) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @GetMapping("/session")
    public ResponseEntity<?> session(HttpServletRequest request) {
        User user = sessions.current(request);
        return user == null ? ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
                : ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(Account.from(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        sessions.end(request);
        return ResponseEntity.noContent().build();
    }
}
