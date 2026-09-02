package ac.za.mycput.controller;

import ac.za.mycput.domain.Cart;
import ac.za.mycput.domain.Customer;
import ac.za.mycput.repository.CustomerRepository;
import ac.za.mycput.service.ICartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final ICartService service;
    private final CustomerRepository customerRepo;

    @Autowired
    public CartController(ICartService service, CustomerRepository customerRepo) {
        this.service = service;
        this.customerRepo = customerRepo;
    }

    @PostMapping("/create")
    public Cart create(@RequestBody Cart cart) {
        return service.create(cart);
    }

    @GetMapping("/read/{id}")
    public Cart read(@PathVariable Long id) {
        return service.read(id);
    }

    @GetMapping("/customer/{customerId}")
    public Cart getByCustomer(@PathVariable Long customerId) {
        Customer customer = this.customerRepo.findById(customerId).orElse(null);

        if (customer == null) {
            return null;
        }

        return service.findByCustomer(customer);
    }

    @PutMapping("/update")
    public Cart update(@RequestBody Cart cart) {
        return service.update(cart);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable Long id) {
        return service.delete(id);
    }

    @GetMapping("/getAll")
    public List<Cart> getAll() {
        return service.getAll();
    }
}