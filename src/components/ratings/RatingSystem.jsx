import React, { useState } from "react";
import styles from "./RatingSystem.module.css";

const RatingSystem = ({ 
  sellerId, 
  currentRating = 0, 
  totalReviews = 0,
  onRate 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRating === 0) {
      alert("Please select a rating");
      return;
    }
    
    onRate({
      rating: selectedRating,
      review: reviewText,
      sellerId,
    });
    
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className={styles.ratingSystem}>
      <div className={styles.ratingSummary}>
        <div className={styles.starDisplay}>
          <span className={styles.ratingNumber}>{currentRating}</span>
          <span className={styles.starIcon}>⭐</span>
        </div>
        <span className={styles.reviewCount}>({totalReviews} reviews)</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.ratingForm}>
        <div className={styles.starInput}>
          <label>Rate this seller:</label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.starBtn} ${star <= (hoverRating || selectedRating) ? styles.active : ""}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setSelectedRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className={styles.reviewInput}>
          <label>Write a review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this seller..."
            rows="3"
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Submit Review
        </button>
      </form>

      {submitted && (
        <div className={styles.successMessage}>
          ✅ Thank you for your review!
        </div>
      )}
    </div>
  );
};

export default RatingSystem;