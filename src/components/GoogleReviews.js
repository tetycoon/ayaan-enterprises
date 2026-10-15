import { GOOGLE_PROFILE, REVIEWS } from "@/lib/reviews";

// "What Our Customers Say": hand-maintained Google reviews from src/lib/reviews.js (no live API).

function GoogleIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Stars({ rating, size = 18 }) {
  return (
    <span className="review-stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" focusable="false" className={n <= Math.round(rating) ? "on" : ""}>
          <path d="M10 1.5l2.6 5.3 5.9.86-4.25 4.14 1 5.86L10 14.9l-5.25 2.76 1-5.86L1.5 7.66l5.9-.86z" />
        </svg>
      ))}
    </span>
  );
}

export function ReviewCard({ review }) {
  return (
    <figure className="card testimonial review-card">
      <figcaption className="review-card-head">
        <span className="review-avatar" aria-hidden="true">
          {review.name.replace(/[^A-Za-z]/g, "").charAt(0)}
        </span>
        <span>
          <cite>{review.name}</cite>
          <small>
            {review.date} · Google{review.excerpt ? " · Excerpt" : ""}
          </small>
        </span>
      </figcaption>
      <Stars rating={review.rating} />
      <blockquote>{review.text}</blockquote>
    </figure>
  );
}

export default function GoogleReviews() {
  const { name, url, writeReviewUrl, rating, totalReviews } = GOOGLE_PROFILE;

  return (
    <section className="section bg-soft" aria-labelledby="reviews-heading">
      <div className="container">
        <div className="section-head center" style={{ maxWidth: "680px", margin: "0 auto 36px" }}>
          <span className="eyebrow">Google Reviews</span>
          <h2 id="reviews-heading">What Our Customers Say</h2>
          <p>
            Reviews from our {name} Google profile. {name} and Ayaan Enterprises are branches of the same company.
          </p>
        </div>

        <div className="review-summary">
          <GoogleIcon size={34} />
          <div>
            <div className="review-summary-score">
              <strong>{rating.toFixed(1)}</strong>
              <Stars rating={rating} size={22} />
            </div>
            <span className="review-summary-meta">
              Based on {totalReviews} Google reviews of {name} · Showing {REVIEWS.length}
            </span>
          </div>
        </div>

        <div className="grid g-3 testimonial-grid reviews-grid">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} review={r} />
          ))}
        </div>

        <div className="btn-row review-actions">
          <a className="btn btn-outline" href={url} target="_blank" rel="noopener noreferrer">
            <GoogleIcon size={18} /> Read All Google Reviews
          </a>
          {writeReviewUrl && (
            <a className="btn btn-amber" href={writeReviewUrl} target="_blank" rel="noopener noreferrer">
              Write a Review
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
