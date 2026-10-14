import { Star, ShoppingCart } from "lucide-react";

export default function ProductCard({ product, onAdd, goToDetail }) {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const cheapest = variants.length ? Math.min(...variants.map((v) => Number(v.price))) : null;
  const fromLabel = cheapest != null ? `from LKR ${cheapest}` : `LKR ${product.price}`;
  return (
    <>
      <style>{`
        :root{
          --accent:#f97316;
          --accent-dark:#ea580c;
          --star:#fbbf24;
          --gray:#d1d5db;
          --surface:#ffffff;
          --radius:1.1rem;
          --shadow-sm:0 4px 6px -1px rgba(0,0,0,.05),0 2px 4px -2px rgba(0,0,0,.05);
          --shadow-lg:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);
          --transition:.35s cubic-bezier(.4,0,.2,1);
        }
        @keyframes shimmer{
          0%{background-position:-200% 0}
          100%{background-position:200% 0}
        }
        @keyframes gel{0%{transform:scale(.6)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
        @keyframes popIn{0%{opacity:0;transform:translateY(20px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}

        .product-card{
          background:var(--surface);border-radius:var(--radius);overflow:hidden;
          box-shadow:var(--shadow-sm);cursor:pointer;
          transition:transform var(--transition),box-shadow var(--transition);
          animation:popIn .6s both cubic-bezier(.4,0,.2,1);
          transform-style:preserve-3d;
        }
        .product-card:hover{
          box-shadow:var(--shadow-lg);
          transform:translateY(-6px) rotateX(5deg) rotateY(-3deg);
        }

        .product-img-wrapper{
          position:relative;overflow:hidden;
        }
        .product-img{
          width:100%;height:16rem;object-fit:cover;
          transition:transform var(--transition);
        }
        .product-card:hover .product-img{transform:scale(1.12) rotate(-2deg);}

        /* liquid shimmer badge */
        .badge{
          position:absolute;top:.9rem;left:.9rem;
          padding:.35rem .9rem;border-radius:9999px;
          font-size:.75rem;font-weight:700;color:#fff;
          background:linear-gradient(90deg,var(--accent),var(--accent-dark),var(--accent));
          background-size:200% auto;
          animation:shimmer 2s infinite linear;
          box-shadow:0 4px 15px -3px rgba(249,115,22,.35);
        }
        .sold-badge{background:#6b7280;background-size:200% auto;}

        /* quick add button – morph */
        .quick-add{
          position:absolute;bottom:1rem;right:1rem;
          background:var(--accent);color:#fff;
          padding:.9rem;border-radius:50%;
          opacity:0;transform:scale(.7);
          transition:opacity var(--transition),transform var(--transition);
          box-shadow:0 6px 20px -5px rgba(249,115,22,.4);
        }
        .product-card:hover .quick-add{opacity:1;transform:scale(1);}
        .quick-add:hover{background:var(--accent-dark);transform:scale(1.15) rotate(8deg);}
        .quick-add:active{animation:gel .4s ease;}

        .product-body{padding:1.2rem 1rem;}
        .product-name{font-weight:700;font-size:1.2rem;margin-bottom:.4rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        
        /* star rating */
        .rating{display:flex;align-items:center;gap:.25rem;margin-bottom:.6rem;}
        .star{width:1.1rem;height:1.1rem;transition:transform .2s;}
        .star:hover{transform:scale(1.3);}
        .filled{color:var(--star);fill:var(--star);}
        
        .review-count{font-size:.875rem;color:var(--gray);}
        
        .product-footer{display:flex;justify-content:space-between;align-items:center;}
        .price{font-size:1.6rem;font-weight:800;color:#10b981;}
        
        /* liquid add btn */
        .add-btn{
          background:linear-gradient(90deg,var(--accent),var(--accent-dark));
          background-size:200% auto;
          color:#fff;padding:.55rem 1.1rem;border-radius:9999px;
          font-size:.875rem;font-weight:600;border:none;cursor:pointer;
          transition:background .3s,transform .3s,box-shadow .3s;
          box-shadow:0 4px 15px -3px rgba(249,115,22,.35);
        }
        .add-btn:hover{background-position:right center;transform:scale(1.06);}
        .add-btn:disabled{background:#9ca3af;cursor:not-allowed;box-shadow:none;}
      `}</style>

      <div className="product-card" onClick={() => goToDetail(product)}>
        <div className="product-img-wrapper">
          {product.badge && <span className="badge">{product.badge}</span>}
          {product.soldOut && <span className="badge sold-badge">Sold Out</span>}
          <img src={product.image} alt={product.name} className="product-img" />
          <button
            onClick={(e) => { e.stopPropagation(); !product.soldOut && onAdd(product, null); }}
            className="quick-add"
            aria-label="Quick add"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
        <div className="product-body">
          <h3 className="product-name">{product.name}</h3>
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`star ${i < Math.floor(product.avgRating || 0) ? "filled" : ""}`}
              />
            ))}
            <span className="review-count">({product.reviews?.length || 0})</span>
          </div>
          <div className="product-footer">
            <span className="price">{fromLabel}</span>
            {variants.length > 0 ? (
              <button
                onClick={(e) => { e.stopPropagation(); goToDetail(product); }}
                className="add-btn"
              >
                {variants.length} options
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); !product.soldOut && onAdd(product, null); }}
                className="add-btn"
                disabled={product.soldOut}
              >
                {product.soldOut ? "Sold Out" : "Add"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}