// src/components/CartPage.jsx
import { useState } from "react";
import { Trash2, ArrowLeft, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react";
import { cartKey } from "../cart";

export default function CartPage({ cart, setCart, setCurrentPage }) {
  /* ---------- helpers (variant-aware: key = productId + variantId) ---------- */
  const updateQty = (key, qty) => {
    setCart((prev) =>
      prev.map((i) => {
        if (cartKey(i) !== key) return i;
        const cap = Math.max(1, Number(i.maxStock ?? 99));
        const next = Math.max(1, Math.min(qty, cap));
        return { ...i, quantity: next };
      })
    );
  };
  const removeItem = (key) => {
    setCart((p) => p.filter((i) => cartKey(i) !== key));
  };
  const total = cart.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);

  /* ---------- tiny micro-interaction states ---------- */
  const [removing, setRemoving] = useState(null);
  const [checkoutShake, setCheckoutShake] = useState(false);

  const onRemove = (id) => {
    setRemoving(id);
    setTimeout(() => removeItem(id), 300); // match animation
  };

  return (
    <>
      <style>{`
        /* ---------- page shell ---------- */
        .cart-shell {
          max-width: 52rem;
          margin: 3rem auto 4rem;
          padding: 0 1rem;
          font-family: "Inter", sans-serif;
          color: #1f2937;
          animation: fadeIn 0.6s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
        }

        /* ---------- glass header ---------- */
        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 1rem;
          padding: 1rem 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          border: none;
          padding: 0.6rem 1.1rem;
          border-radius: 0.7rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: background 0.25s, transform 0.2s;
        }
        .back-btn:hover {
          background: #e5e7eb;
          transform: translateX(-4px);
        }
        .cart-title {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ---------- empty ---------- */
        .empty-box {
          text-align: center;
          padding: 4rem 1rem;
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
        }
        .empty-box svg {
          margin: 0 auto 1rem;
          opacity: 0.2;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          50% {
            transform: translateY(-8px);
          }
        }

        /* ---------- table ---------- */
        .cart-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
        }
        .cart-th {
          background: #fafafa;
          padding: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6b7280;
        }
        .cart-td {
          padding: 1rem;
          vertical-align: middle;
          border-top: 1px solid #f3f4f6;
        }
        .row.removing {
          animation: slideOut 0.3s ease forwards;
        }
        @keyframes slideOut {
          to {
            opacity: 0;
            transform: translateX(-20px);
          }
        }

        /* ---------- qty stepper ---------- */
        .qty-stepper {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.25rem 0.6rem;
        }
        .qty-stepper button {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.2s, transform 0.15s;
        }
        .qty-stepper button:hover {
          color: #f97316;
          transform: scale(1.2);
        }
        .qty-stepper span {
          min-width: 2rem;
          text-align: center;
          font-weight: 600;
        }

        /* ---------- trash ---------- */
        .trash-btn {
          background: #fee2e2;
          color: #ef4444;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .trash-btn:hover {
          background: #fecaca;
          transform: scale(1.1) rotate(-8deg);
        }

        /* ---------- total row ---------- */
        .total-row {
          background: #fffbeb;
          font-weight: 800;
          font-size: 1.125rem;
          color: #f59e0b;
        }

        /* ---------- checkout ---------- */
        .checkout-bar {
          margin-top: 2rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
        }
        .checkout-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          border: none;
          padding: 0.9rem 2rem;
          border-radius: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        }
        .checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
        }
        .checkout-btn.shake {
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px);
          }
          75% {
            transform: translateX(6px);
          }
        }
      `}</style>

      <div className="cart-shell">
        <header className="cart-header">
          <button className="back-btn" onClick={() => setCurrentPage("shop")}>
            <ArrowLeft size={18} />
            <span>Continue shopping</span>
          </button>
          <h1 className="cart-title">Your cart ({cart.length})</h1>
        </header>

        {cart.length === 0 ? (
          <div className="empty-box">
            <ShoppingBag size={64} />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th className="cart-th">Product</th>
                  <th className="cart-th">Price</th>
                  <th className="cart-th">Quantity</th>
                  <th className="cart-th">Subtotal</th>
                  <th className="cart-th" aria-label="remove" />
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const key = cartKey(item);
                  const cap = Math.max(1, Number(item.maxStock ?? 99));
                  return (
                  <tr key={key} className={removing === key ? "row removing" : ""}>
                    <td className="cart-td">
                      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                        {item.image && (
                          <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: ".5rem" }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 700 }}>{item.name}</div>
                          {item.sku && <div style={{ fontSize: ".75rem", color: "#6b7280" }}>SKU: {item.sku}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="cart-td">LKR {item.price}</td>
                    <td className="cart-td">
                      <div className="qty-stepper">
                        <button onClick={() => (item.quantity <= 1 ? onRemove(key) : updateQty(key, item.quantity - 1))}>
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(key, item.quantity + 1)} disabled={item.quantity >= cap} title={item.quantity >= cap ? `Only ${cap} in stock` : "Increase"}>
                          <Plus size={16} />
                        </button>
                      </div>
                      {item.quantity >= cap && <div style={{ fontSize: ".72rem", color: "#b45309" }}>Max stock: {cap}</div>}
                    </td>
                    <td className="cart-td">LKR {(item.price * item.quantity).toFixed(2)}</td>
                    <td className="cart-td">
                      <button className="trash-btn" onClick={() => onRemove(key)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                  );
                })}
                <tr className="total-row">
                  <td colSpan={3}>Total</td>
                  <td colSpan={2}>LKR {total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div className="checkout-bar">
              <button
                className={`checkout-btn ${checkoutShake ? "shake" : ""}`}
                onClick={() => {
                  if (total <= 0) {
                    setCheckoutShake(true);
                    setTimeout(() => setCheckoutShake(false), 400);
                    return;
                  }
                  setCurrentPage("checkout");
                }}
              >
                <CreditCard size={20} />
                <span>Proceed to checkout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}