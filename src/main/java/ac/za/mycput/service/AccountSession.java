package ac.za.mycput.service;

import ac.za.mycput.domain.Customer;
import ac.za.mycput.domain.User;
import ac.za.mycput.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class AccountSession {
    private static final String USER_ID = "radiantskin.userId";
    private final UserRepository users;

    public AccountSession(UserRepository users) {
        this.users = users;
    }

    public void start(HttpServletRequest request, User user) {
        end(request);
        HttpSession session = request.getSession(true);
        session.setAttribute(USER_ID, user.getUserId());
        session.setMaxInactiveInterval(30 * 60);
    }

    public User current(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || !(session.getAttribute(USER_ID) instanceof Long id)) return null;
        User user = users.findById(id).orElse(null);
        if (user == null) session.invalidate();
        return user;
    }

    public Customer customer(HttpServletRequest request) {
        User user = current(request);
        return user instanceof Customer customer ? customer : null;
    }

    public void end(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
    }
}
