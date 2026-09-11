import { useState, useEffect } from "react";

interface Customer {
    userId : number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}
interface Review {
    reviewId: number ;
    rating: number;
    comment: String;
    reviewDate:String;
    customer:{userId: number };
    product:{productId: number; name?: string };
}

//This shows the LOGGED-IN customer's own review across every product
//they reviewed (edit/delete only

function ReviewManager(){
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("customer ");
        if (!stored) {
            return;
        }
        const parsed: Customer = JSON.parse(stored);
        setCustomer(parsed);

        fetch("http://localhost:8080/review/getAll")
            .then((response) => response.json())
            .then((data: Review[]) =>
                setReviews(data.filter((r) => r.customer?.userId === parsed.userId))
            );
    }, []);

    const handleEditClick = (review: Review) => {
        setRating(review.rating);
        setComment(review.comment);
        setEditingId(review.reviewId);
    };

    const handleCancelEdit = () => {
        setRating(0);
        setComment("")
        setEditingId(null)
    };
    const handleSave = (review: Review) => {
        if(customer || rating ===0 || !comment.trim ()){
           return;
        }

        fetch("http://localhost:8080/review/update",{
            method: "PUT",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({
                reviewId: review.reviewId,
                rating,
                comment,
                customer: { userId: customer.userId },
                product: { productId: review.product.productId },
                }),
            })
            .then((response) => response.json())
            .then((updated: Review ) => {
                setReviews((prev) =>
                prev.map((r) => (r.reviewId === updated.reviewId ? updated : r))
                );
                handleCancelEdit();
            });
    };
     const handleDelete = (reviewId: number) => {
         fetch(`http://localhost:8080/review/delete/${reviewId}`,{
             method:"DELETE",
             })
             .then((response) =>response.json())
             .then((success:boolean)=> {
                 if(success){
                     setReviews((prev) =>  prev.filter((r) => r.reviewId !== reviewId));
                 }
             });
     };
     if(!customer){
         return null;
     }

    return (
        <div className="panel">
            <div className="panel-head">
                <h3>My Reviews</h3>
            </div>

            {reviews.length === 0 && (
                <p>You haven't reviewed any products yet. Reviews can be added from a product's page.</p>
            )}

            {reviews.map((review) => (
                <div className="cart-item" key={review.reviewId}>
                    {editingId === review.reviewId ? (
                        <div className="cart-item-info">
                            <div className="star-input">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={star <= rating ? "filled" : ""}
                                        onClick={() => setRating(star)}
                                    >
                    ★
                  </span>
                                ))}
                            </div>
                            <div className="form-group">
                                <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                            </div>
                            <button className="btn btn-primary" onClick={() => handleSave(review)}>
                                Save Changes
                            </button>{" "}
                            <button className="btn btn-outline" onClick={handleCancelEdit}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-item-info">
                                <div className="star-input">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className={star <= review.rating ? "filled" : ""}>
                      ★
                    </span>
                                    ))}
                                </div>
                                <p>{review.comment}</p>
                                <small>{review.reviewDate}</small>
                            </div>
                            <button className="btn btn-outline" onClick={() => handleEditClick(review)}>
                                Edit
                            </button>
                            <button className="icon-btn" onClick={() => handleDelete(review.reviewId)}>
                                🗑
                            </button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}




