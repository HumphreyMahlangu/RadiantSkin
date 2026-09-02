package ac.za.mycput.controller;

import ac.za.mycput.domain.Order;
import ac.za.mycput.domain.OrderStatus;
import ac.za.mycput.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
public class OrderController {

    private final IOrderService service;

    @Autowired
    public OrderController(IOrderService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Order create(@RequestBody Order order) {
        return service.create(order);
    }

    @PostMapping("/checkout/{customerId}")
    public ResponseEntity<?> checkout(@PathVariable Long customerId) {
        try {
            Order order = service.checkout(customerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/read/{orderId}")
    public Order read(@PathVariable Long orderId) {
        return service.read(orderId);
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getByCustomer(@PathVariable Long customerId) {
        return service.findByCustomerId(customerId);
    }

    @PutMapping("/update")
    public Order update(@RequestBody Order order) {
        return service.update(order);
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<?> updateStatus(@RequestBody Map<String, Object> request) {
        try {
            Long orderId = Long.valueOf(request.get("orderId").toString());
            OrderStatus status = OrderStatus.valueOf(request.get("status").toString());

            Order updated = service.updateStatus(orderId, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request");
        }
    }

    @DeleteMapping("/delete/{orderId}")
    public boolean delete(@PathVariable Long orderId) {
        return service.delete(orderId);
    }

    @GetMapping("/getAll")
    public List<Order> getAll() {
        return service.getAll();
    }
}