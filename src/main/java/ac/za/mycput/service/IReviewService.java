package ac.za.mycput.service;
/*
/Name: Siphokazi Malingatshoni
/Student Number: 222868708
 */

import ac.za.mycput.domain.Review;
import java.util.List;

public interface IReviewService extends IService<Review, Long> {

    List<Review> findByProductId(Long productId);

    List<Review> findByCustomerId(Long customerId);

    Review addReview(Long customerId, Long productId, int rating, String comment);
}