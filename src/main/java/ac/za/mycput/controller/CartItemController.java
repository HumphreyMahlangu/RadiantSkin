package ac.za.mycput.controller;

import ac.za.mycput.domain.Cart;
import ac.za.mycput.domain.CartItem;
import ac.za.mycput.service.ICartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/cartitem")
public class CartItemController {

    private final ICartItemService service;

    @Autowired
    public CartItemController(ICartItemService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> request) {
        try {
            Long customerId = Long.valueOf(request.get("customerId").toString());
            Long productId = Long.valueOf(request.get("productId").toString());
            int quantity = Integer.parseInt(request.get("quantity").toString());

            Cart cart = service.addToCart(customerId, productId, quantity);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/updateQuantity")
    public ResponseEntity<?> updateQuantity(@RequestBody Map<String, Object> request) {
        try {
            Long cartItemId = Long.valueOf(request.get("cartItemId").toString());
            int quantity = Integer.parseInt(request.get("quantity").toString());

            CartItem item = service.read(cartItemId);

            if (item == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cart item not found");
            }

            item.setQuantity(quantity);
            return ResponseEntity.ok(service.update(item));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request");
        }
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable Long id) {
        return service.delete(id);
    }
}