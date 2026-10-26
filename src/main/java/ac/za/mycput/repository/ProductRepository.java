package ac.za.mycput.repository;

import ac.za.mycput.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Product p where p.productId = :id")
    Optional<Product> findForCheckout(@Param("id") Long id);

    List<Product> findByBrand(String brand);

    List<Product> findByNameContainingIgnoreCase(String keyword);

    List<Product> findByStockQuantityGreaterThan(int quantity);

    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
}
