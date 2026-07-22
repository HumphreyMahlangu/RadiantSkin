package ac.za.mycput.controller;

import ac.za.mycput.domain.User;
import ac.za.mycput.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final IUserService service;

    @Autowired
    public UserController(IUserService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public User create(@RequestBody User user) {
        return service.create(user);
    }

    @GetMapping("/read/{id}")
    public User read(@PathVariable Long id) {
        return service.read(id);
    }

    @PostMapping("/update")
    public User update(@RequestBody User user) {
        return service.update(user);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable Long id) {
        return service.delete(id);
    }

    @GetMapping("/getAll")
    public List<User> getAll() {
        return service.getAll();
    }

    @GetMapping("/findByEmail/{email}")
    public User findByEmail(@PathVariable String email) {
        return service.findByEmail(email);
    }
}
