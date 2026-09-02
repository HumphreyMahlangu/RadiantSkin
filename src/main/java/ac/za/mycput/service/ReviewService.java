package ac.za.mycput.service;

import ac.za.mycput.domain.Customer;
import ac.za.mycput.domain.Product;
import ac.za.mycput.domain.Review;
import ac.za.mycput.repository.CustomerRepository;
import ac.za.mycput.repository.ProductRepository;
import ac.za.mycput.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReviewService implements IReviewService {

    private final ReviewRepository repository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    @Autowired
    public ReviewService(ReviewRepository repository, CustomerRepository customerRepository, ProductRepository productRepository) {
        this.repository = repository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Review create(Review review) {
        return repository.save(review);
    }

    @Override
    public Review read(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Review update(Review review) {
        return repository.save(review);
    }

    @Override
    public boolean delete(Long id) {
        repository.deleteById(id);
        return true;
    }

    @Override
    public List<Review> getAll() {
        return repository.findAll();
    }

    @Override
    public List<Review> findByProductId(Long productId) {
        Product product = this.productRepository.findById(productId).orElse(null);

        if (product == null) {
            return null;
        }

        return this.repository.findByProduct(product);
    }

    @Override
    public List<Review> findByCustomerId(Long customerId) {
        Customer customer = this.customerRepository.findById(customerId).orElse(null);

        if (customer == null) {
            return null;
        }

        return this.repository.findByCustomer(customer);
    }

    @Override
    public Review addReview(Long customerId, Long productId, int rating, String comment) {

        Customer customer = this.customerRepository.findById(customerId).orElse(null);
        Product product = this.productRepository.findById(productId).orElse(null);

        if (customer == null || product == null) {
            throw new IllegalArgumentException("Customer or product not found");
        }

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Review review = new Review.Builder()
                .setCustomer(customer)
                .setProduct(product)
                .setRating(rating)
                .setComment(comment)
                .setReviewDate(LocalDate.now())
                .build();

        return this.repository.save(review);
    }
}