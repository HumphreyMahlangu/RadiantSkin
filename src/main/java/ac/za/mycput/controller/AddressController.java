package ac.za.mycput.controller;

/*
// Name : Siphokazi Malingatshoni
// Student no :222868708
 */

import ac.za.mycput.domain.Address;
import ac.za.mycput.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java .util.List;

@RestController
@RequestMapping("/address")
public class AddressController {

    @Autowired
    private AddressService service;

    @PostMapping("/create")
    public Address create(@RequestBody Address address){
        return service.create(address);
    }
    @GetMapping("/read/{id}")
    public Address read(@PathVariable Long id){
        return service.read(id);
    }
    @GetMapping("/all")
    public List<Address>getAll(){
        return service.getAll();
    }
    @PutMapping("/update")
    public Address update(@RequestBody Address address){
        return service.update(address);
    }
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVairiable Long id){
        service.delete(id);
    }


}

