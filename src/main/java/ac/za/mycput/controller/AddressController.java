package ac.za.mycput.controller;

/*
// Name : Siphokazi Malingatshoni
// Student no :222868708
 */

import ac.za.mycput.domain.Address;
import ac.za.mycput.service.IAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/address")
public class AddressController {

    private final IAddressService service;

    @Autowired
    public AddressController(IAddressService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Address create(@RequestBody Address address) {
        return service.create(address);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAddress(@RequestBody Map<String, Object> request) {
        try {
            Long customerId = Long.valueOf(request.get("customerId").toString());
            String street = (String) request.get("street");
            String city = (String) request.get("city");
            String province = (String) request.get("province");
            String postalCode = (String) request.get("postalCode");
            String country = (String) request.get("country");

            Address saved = service.addAddress(customerId, street, city, province, postalCode, country);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/read/{id}")
    public Address read(@PathVariable Long id) {
        return service.read(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<Address> getByCustomer(@PathVariable Long customerId) {
        return service.findByCustomerId(customerId);
    }

    @PutMapping("/update")
    public Address update(@RequestBody Address address) {
        return service.update(address);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable Long id) {
        return service.delete(id);
    }

    @GetMapping("/getAll")
    public List<Address> getAll() {
        return service.getAll();
    }
}