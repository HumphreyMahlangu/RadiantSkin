package ac.za.mycput.controller;

import ac.za.mycput.domain.Admin;
import ac.za.mycput.service.IAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final IAdminService service;

    @Autowired
    public AdminController(IAdminService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Admin create(@RequestBody Admin admin) {
        return service.create(admin);
    }

    @GetMapping("/read/{id}")
    public Admin read(@PathVariable Long id) {
        return service.read(id);
    }

    @PostMapping("/update")
    public Admin update(@RequestBody Admin admin) {
        return service.update(admin);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable Long id) {
        return service.delete(id);
    }

    @GetMapping("/getAll")
    public List<Admin> getAll() {
        return service.getAll();
    }

    @GetMapping("/findByEmail/{email}")
    public Admin findByEmail(@PathVariable String email) {
        return service.findByEmail(email);
    }
}
