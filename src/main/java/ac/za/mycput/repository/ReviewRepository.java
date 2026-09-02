package ac.za.mycput.repository;

import ac.za.mycput.domain.Review;
import ac.za.mycput.domain.Product;
import ac.za.mycput.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

 List<Review> findByProduct(Product product);

 List<Review> findByCustomer(Customer customer);
}
