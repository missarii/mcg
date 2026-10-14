import { useState, useEffect } from "react";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";
import { api } from "../api";

export default function ProductDetail({ product, addToCart, setCurrentPage, updateProductReview }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.length ? String(variants[0].id || variants[0]._id) : ""
  );
  const selectedVariant = variants.find((v) => String(v.id || v._id) === String(selectedVariantId)) || null;

  const shownImage = selectedVariant?.image || product.image;
  const shownName = selectedVariant ? `${product.name} — ${selectedVariant.name}` : product.name;
  const shownPrice = selectedVariant ? selectedVariant.price : product.price;
  const shownDesc = selectedVariant?.description || product.description;
  const shownStock = selectedVariant ? Number(selectedVariant.stock ?? 0) : Number(product.stock ?? 0);
  const shownSoldOut = selectedVariant
    ? !!selectedVariant.soldOut || shownStock <= 0
    : !!product.soldOut;

  useEffect(() => {
    let live = true;
    api.getReviews(product.id)
      .then((r) => { if (live) setReviews(r || []); })
      .catch(() => { if (live) setReviews(product.reviews || []); });
    return () => { live = false; };
  }, [product.id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (rating > 0 && review) {
      try {
        const saved = await api.addReview(product.id, { rating, text: review, author: "Customer" });
        const newReview = { rating: saved.rating, text: saved.text, date: new Date(saved.createdAt).toLocaleDateString() };
        updateProductReview(product.id, newReview);
        setReviews(prev => [...prev, saved]);
      } catch {
        const newReview = { rating, text: review, date: new Date().toLocaleDateString() };
        updateProductReview(product.id, newReview);
        setReviews(prev => [...prev, newReview]);
      }
      setRating(0);
      setReview("");
    }
  };

  return (
    <>
      <style>{`
        :root {
          --accent: #f97316;
          --accent-dark: #ea580c;
          --star: #fbbf24;
          --gray: #6b7280;
          --radius: 1rem;
          --transition: .35s cubic-bezier(.4, 0, .2, 1);
        }

        @keyframes popIn {
          0% { opacity: 0; transform: translateY(20px) scale(.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .detail {
          max-width: 48rem;
          margin: 2rem auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: popIn .6s var(--transition);
        }

        /* Back button above image */
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 1rem;
          transition: color .3s, transform .3s;
        }
        .back-btn:hover { color: var(--accent-dark); transform: translateX(-4px); }

        /* Centered image preview */
        .image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f9fafb;
          border-radius: var(--radius);
          padding: 1rem;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 580px;
          margin-bottom: 2rem;
        }

        .detail-img {
          width: 100%;
          max-width: 540px;
          height: auto;
          border-radius: var(--radius);
          object-fit: contain;
          box-shadow: 0 10px 20px -5px rgba(0,0,0,.1);
          transition: transform var(--transition);
        }
        .detail-img:hover { transform: scale(1.05) rotate(-1deg); }

        .detail-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          width: 100%;
        }

        .detail-name { font-size: 2rem; font-weight: 800; }
        .price { font-size: 1.6rem; color: #10b981; font-weight: 800; }

        .star-rater { display: flex; gap: .4rem; justify-content: center; }
        .star-icon {
          width: 1.8rem; height: 1.8rem; cursor: pointer;
          color: var(--gray); transition: color .2s, transform .2s, filter .2s;
        }
        .star-icon:hover { transform: scale(1.25); filter: drop-shadow(0 0 6px var(--star)); }
        .star-icon.filled { color: var(--star); filter: drop-shadow(0 0 8px var(--star)); }

        .submit-btn {
          background: linear-gradient(90deg, var(--accent), var(--accent-dark));
          background-size: 200% auto;
          color: #fff;
          border: none;
          padding: .6rem 1.3rem;
          border-radius: 9999px;
          font-weight: 600;
          cursor: pointer;
          transition: background .3s, transform .3s;
          box-shadow: 0 4px 15px -3px rgba(249,115,22,.35);
        }
        .submit-btn:hover { background-position: right center; transform: scale(1.05); }

        .review-item {
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem 0;
          text-align: left;
          animation: popIn .4s ease both;
        }
      `}</style>

      <div className="detail">
        <button onClick={() => setCurrentPage("shop")} className="back-btn">
          <ArrowLeft size={20} /> Back to Shop
        </button>

        <div className="image-container">
          <img src={shownImage} alt={shownName} className="detail-img" />
        </div>

        <div className="detail-info">
          <h1 className="detail-name">{shownName}</h1>

          {variants.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", justifyContent: "center" }}>
              {variants.map((v) => {
                const vid = String(v.id || v._id);
                const vOut = !!v.soldOut || Number(v.stock ?? 0) <= 0;
                const active = vid === String(selectedVariantId);
                return (
                  <button
                    key={vid}
                    type="button"
                    disabled={vOut}
                    onClick={() => setSelectedVariantId(vid)}
                    title={vOut ? `${v.name} — out of stock` : `${v.name} — LKR ${v.price}`}
                    style={{
                      display: "flex", alignItems: "center", gap: ".5rem",
                      padding: ".45rem .8rem .45rem .45rem", borderRadius: "999px",
                      border: active ? "2px solid #f97316" : "1.5px solid #e5e7eb",
                      background: vOut ? "#f3f4f6" : active ? "#fff7ed" : "#fff",
                      opacity: vOut ? 0.55 : 1, cursor: vOut ? "not-allowed" : "pointer",
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {v.image && <img src={v.image} alt={v.name} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }} />}
                    <span>{v.name}</span>
                    <span style={{ color: "#059669", fontWeight: 700 }}>LKR {v.price}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: ".5rem" }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                style={{ color: i < (product.avgRating || 0) ? "var(--star)" : "var(--gray)" }}
              />
            ))}
            <span>({reviews.length} reviews)</span>
          </div>

          <p className="price">LKR {shownPrice}</p>
          <p>{shownDesc}</p>
          {selectedVariant?.sku && (
            <p style={{ color: "#6b7280", fontSize: ".9rem" }}>SKU: {selectedVariant.sku} • Stock: {shownStock}</p>
          )}
          {!selectedVariant && typeof product.stock === 'number' && (
            <p style={{ color: "#6b7280", fontSize: ".9rem" }}>Stock: {shownStock}</p>
          )}

          {shownSoldOut ? (
            <p style={{ color: "#ef4444", fontWeight: 600 }}>Sold Out</p>
          ) : (
            <button onClick={() => addToCart(product, selectedVariant)} className="submit-btn">
              <ShoppingCart size={20} style={{ verticalAlign: "middle", marginRight: ".5rem" }} />
              Add to Cart{selectedVariant ? ` — ${selectedVariant.name}` : ""}
            </button>
          )}

          {/* Review Form */}
          <div style={{ marginTop: "2rem", width: "100%", maxWidth: "30rem" }}>
            <h3>Leave a Review</h3>
            <form onSubmit={handleReview}>
              <div className="star-rater">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star
                    key={n}
                    className={`star-icon ${n <= rating ? "filled" : ""}`}
                    onClick={() => setRating(n)}
                  />
                ))}
              </div>
              <textarea
                placeholder="Your review..."
                value={review}
                onChange={e => setReview(e.target.value)}
                rows={3}
                required
                style={{
                  width: "100%",
                  padding: ".75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: ".5rem",
                  marginTop: ".5rem",
                  resize: "none"
                }}
              />
              <button type="submit" className="submit-btn" style={{ marginTop: ".5rem" }}>
                Submit Review
              </button>
            </form>
          </div>

          {/* Review List */}
          <div style={{ marginTop: "2rem", width: "100%", maxWidth: "30rem" }}>
            <h3>Reviews</h3>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((r, i) => (
                <div key={i} className="review-item">
                  <div style={{ display: "flex", gap: ".25rem" }}>
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        style={{ color: j < r.rating ? "var(--star)" : "var(--gray)" }}
                      />
                    ))}
                  </div>
                  <p>{r.text}</p>
                  <small style={{ color: "var(--gray)" }}>{r.author ? `${r.author} • ` : ''}{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.date}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
