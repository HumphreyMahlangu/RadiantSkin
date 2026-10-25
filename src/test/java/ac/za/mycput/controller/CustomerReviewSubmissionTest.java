package ac.za.mycput.controller;

import ac.za.mycput.domain.Customer;
import ac.za.mycput.domain.Review;
import ac.za.mycput.service.CustomerService;
import ac.za.mycput.service.IReviewService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomerReviewSubmissionTest {

    @Test
    void registeredCustomerCanSubmitAndReadAReviewWithoutExposingAccountDetails() {
        IReviewService reviews = mock(IReviewService.class);
        CustomerService customers = mock(CustomerService.class);
        Customer customer = mock(Customer.class);
        when(customer.getUserId()).thenReturn(9L);
        when(customers.login("customer@example.com", "secret")).thenReturn(customer);
        Review saved = new Review.Builder()
                .setReviewId(21L)
                .setRating(5)
                .setComment("Gentle cleanser")
                .setReviewDate(LocalDate.of(2026, 10, 25))
                .build();
        when(reviews.addReview(9L, 7L, 5, "Gentle cleanser")).thenReturn(saved);
        when(reviews.findByProductId(7L)).thenReturn(List.of(saved));

        ReviewController controller = new ReviewController(reviews, customers);
        var response = controller.submit(new ReviewController.ReviewSubmission(
                7L, 5, "Gentle cleanser", "customer@example.com", "secret"));

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        var view = assertInstanceOf(ReviewController.ReviewView.class, response.getBody());
        assertEquals(21L, view.reviewId());
        assertEquals("Gentle cleanser", view.comment());
        assertEquals(List.of(view), controller.getByProduct(7L));
        verify(reviews).addReview(9L, 7L, 5, "Gentle cleanser");
    }

    @Test
    void incorrectPasswordCannotCreateAReview() {
        IReviewService reviews = mock(IReviewService.class);
        CustomerService customers = mock(CustomerService.class);
        when(customers.login("customer@example.com", "wrong"))
                .thenThrow(new IllegalArgumentException("Invalid email or password"));

        var response = new ReviewController(reviews, customers).submit(
                new ReviewController.ReviewSubmission(7L, 5, "Gentle cleanser",
                        "customer@example.com", "wrong"));

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verifyNoInteractions(reviews);
    }
}
