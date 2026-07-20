package ac.za.mycput.controller;

/*
//Name: Siphokazi Malingatshoni
// Student number: 222868708
 */

import ac.za.mycput.domain.Address;
import ac.za.mycput.domain.Review;
import ac.za.mycput.factory.ReviewFactory;
import ac.za.mycput.service.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
 class ReviewControllerTest {

  @Autowired
  private Review Controller
  reviewController;

  @MockBean
  private ReviewService addressService;

  private Review review;

  @BeforeEach
  void setUp() {
   review = ReviewFactory.createReview(
           1L,
           5,
           "Good Product",
           LocalDate.now(),
           null,
           null
   );

  }

  @Test
  void create() {
   Mockito.when(reviewService.create(review)).thenReturn(review);

   ResponseEntity<Review> response = reviewController.create(review);
   AssertNotNull(response);
   assertEquals(200, response.getStatusCodeValue());
   assertEquals(review, response.getBody());

  }

  @Test
  void read() {
   Mockito.when(reviewService.read(1L)).thenReturn(review);

   ResponseEntity<Review> response = reviewController.read(1L);
   AssertNotNull(response);
   assertEquals(200, response.getStatusCodeValue());
   assertEquals(review, response.getBody());
  }

  @Test
  void update() {
   Mockito.when(reviewService.update(review)).thenReturn(review);

   ResponseEntity<Review> response = reviewController.update(review);
   AssertNotNull(response);
   assertEquals(200, response.getStatusCodeValue());
   assertEquals(review, response.getBody());

  }

  @Test
  void delete() {
   Mockito.doNothing().when(reviewService).delete(1L);

   ResponseEntity<Void> response = reviewController.delete(1L);
   assertEquals(200, response.getStatusCodeValue());
   assertEquals(review, response.getBody());

  }

  @Test
  void getAll() {
   Mockito.when(reviewService.getAll()).thenReturn(List.of(review));

   ResponseEntity<List<Review>> response = reviewController.getAll();
   AssertNotNull(response);

   assertEquals(200, response.getStatusCodeValue());
   assertFalse(response.getBody().isEmpty());

  }
 }