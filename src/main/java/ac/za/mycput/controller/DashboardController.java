package ac.za.mycput.controller;

import ac.za.mycput.repository.CustomerRepository;
import ac.za.mycput.repository.ProductRepository;
import ac.za.mycput.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    @Autowired
    public DashboardController(CustomerRepository customerRepository, ProductRepository productRepository, ReviewRepository reviewRepository) {
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("totalCustomers", this.customerRepository.count());
        stats.put("totalProducts", this.productRepository.count());
        stats.put("totalReviews", this.reviewRepository.count());

        return stats;
    }
}
