package ac.za.mycput.controller;

/*
// Name : Siphokazi Malingatshoni
// Student no :222868708
 */

import ac.za.mycput.domain.Review;
import ac.za.mycput.service.IReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/review")
public class ReviewController {

    private final IReviewService service;

    @Autowired
    public ReviewController(IReviewService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Review create(@RequestBody Review review) {
        return service.create(review);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> request) {
        try {
            Long customerId = Long.valueOf(request.get("customerId").toString());
            Long productId = Long.valueOf(request.get("productId").toString());
            int rating = Integer.parseInt(request.get("rating").toString());
            String comment = (String) request.get("comment");

            Review saved = service.addReview(customerId, productId, rating, comment);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/read/{id}")
    public Review read(@PathVariable Long id) {
        return service.read(id);
    }

    @GetMapping("/product/{productId}")
    public List<Review> getByProduct(@PathVariable Long productId) {
        return service.findByProductId(productId);
    }

    @GetMapping("/customer/{customerId}")
    public List<Review> getByCustomer(@PathVariable Long customerId) {
        return service.findByCustomerId(customerId);
    }

    @PutMapping("/update")
    public Review update(@RequestBody Review review) {
        return service.update(review);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable Long id) {
        return service.delete(id);
    }

    @GetMapping("/getAll")
    public List<Review> getAll() {
        return service.getAll();
    }
}