package ac.za.mycput.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

/*
*Name: Siphokazi Malingatshoni
* Student Number:222868708
* Date: 2026/06/21
 */
@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    private int rating;
    private String comment;
    private LocalDate reviewDate;

    //MANY REVIEWS → One product
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    //MANY reviews → One customer
    //link with customer class when available
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public Review() {
    }
    public Review (Builder builder){
        this.reviewId = builder.reviewId;
        this. rating = builder.rating;
        this.comment = builder.comment;
        this.reviewDate = builder.reviewDate;

    }

    public Long getReviewId() {
        return reviewId;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDate getReviewDate() {
        return reviewDate;
    }

    public static class Builder{
        private Long reviewId;
        private int rating;
        private String comment;
        private LocalDate reviewDate;

        public Builder setReviewId(Long reviewId){
            this.reviewId = reviewId;
            return this;
        }

        public Builder setRating(int rating){
            this.rating = rating;
            return this;
        }

        public Builder setComment(String comment){
            this.comment = comment;
            return this;
        }

        public Builder setReviewDate(LocalDate reviewDate){
            this.reviewDate = reviewDate;
            return this;
        }

        public  Review build(){
         return new Review(this);
        }
    }
}
