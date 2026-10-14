// src/components/CheckoutPage.jsx
import { useState } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Home, FileText, ShoppingBag } from "lucide-react";
import { api } from "../api";

export default function CheckoutPage({ cart, setCart, setCurrentPage }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", note: ""
  });
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setOrderError("");
    try {
      const order = await api.createOrder({
        ...form,
        items: cart.map((i) => ({ productId: String(i.productId), variantId: i.variantId || undefined, quantity: Number(i.quantity) })),
      });
      // Clear cart ONLY after the order is confirmed
      setCart([]);
      alert(`Order placed! Total LKR ${Number(order.total).toFixed(2)}. Door delivery confirmed.`);
      setCurrentPage("home");
    } catch (err) {
      console.error(err);
      const msg = String(err?.message || '');
      const clean = msg.replace(/^API 400:\s*/, '').replace(/^API \d+:\s*/, '');
      try {
        const parsed = JSON.parse(clean);
        setOrderError(parsed.message || clean);
      } catch {
        setOrderError(clean || "Could not place order. Please try again.");
      }
    } finally {
      setPlacing(false);
    }
  };

  /* --------------  STYLES + ANIMATIONS  -------------- */
  const styles = `
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
    @keyframes pop   { 0% { transform:scale(.95) } 50% { transform:scale(1.02) } 100% { transform:scale(1) } }

    .checkout-wrapper{ max-width:50rem; margin:3rem auto; padding:1.5rem; animation:fadeIn .6s ease; }
    .back-btn{ display:inline-flex; align-items:center; gap:.5rem; background:#fff0; border:2px solid #f97316; color:#f97316; padding:.4rem .9rem; border-radius:2rem; cursor:pointer; font-weight:600; transition:.25s; }
    .back-btn:hover{ background:#f97316; color:#fff; transform:translateX(-4px); }
    h2.title{ font-size:2.2rem; font-weight:800; text-align:center; margin:1rem 0 2rem; letter-spacing:-.5px; }
    .checkout-grid{ display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; }
    @media(max-width:900px){ .checkout-grid{ grid-template-columns:1fr } }

    .glass{ background:rgba(255,255,255,.65); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.4); box-shadow:0 8px 32px rgba(0,0,0,.08); border-radius:1.2rem; padding:1.8rem; animation:fadeIn .7s ease; }
    .form-group{ display:flex; flex-direction:column; margin-bottom:1.1rem; }
    .form-group label{ display:flex; align-items:center; gap:.4rem; font-weight:600; margin-bottom:.35rem; color:#444; }
    .input, .textarea{ padding:.85rem 1rem; border:1px solid #e5e7eb; border-radius:.7rem; font-size:1rem; transition:.2s; }
    .input:focus, .textarea:focus{ outline:none; border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,.18); }
    .textarea{ resize:vertical; min-height:90px; }

    .order-summary{ background:linear-gradient(145deg,#fff9f5,#fff); border:1px solid #ffe8d6; border-radius:1.2rem; padding:1.8rem; animation:pop .4s ease; }
    .summary-item{ display:flex; justify-content:space-between; margin-bottom:.6rem; font-size:1.05rem; }
    .summary-item.total{ font-weight:800; font-size:1.3rem; color:#ea580c; margin-top:1rem; padding-top:1rem; border-top:2px dashed #f97316; }
    .delivery-note{ display:flex; align-items:center; gap:.5rem; font-size:.95rem; color:#16a34a; margin-top:1rem; }
    .place-order{ width:100%; margin-top:1.5rem; background:linear-gradient(135deg,#f97316 0%,#ea580c 100%); color:#fff; font-weight:700; font-size:1.1rem; padding:.9rem; border:none; border-radius:.8rem; cursor:pointer; transition:.25s; box-shadow:0 4px 20px -4px rgba(249,115,22,.6); }
    .place-order:hover{ transform:translateY(-2px); box-shadow:0 6px 24px -4px rgba(249,115,22,.75); }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="checkout-wrapper">
        <button onClick={() => setCurrentPage("cart")} className="back-btn">
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <h2 className="title">Checkout – Door Delivery</h2>

        <form onSubmit={handleSubmit} className="checkout-grid">
          {/* ----  LEFT: DELIVERY DETAILS  ---- */}
          <section className="glass">
            <h3 style={{ marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
              <Home size={20} color="#f97316" /> Delivery Details
            </h3>

            <div className="form-group">
              <label><User size={16} /> Full Name</label>
              <input className="input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label><Mail size={16} /> Email</label>
              <input className="input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="form-group">
              <label><Phone size={16} /> Phone</label>
              <input className="input" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="form-group">
              <label><MapPin size={16} /> Address</label>
              <input className="input" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>

            <div className="form-group">
              <label><Home size={16} /> City</label>
              <input className="input" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>

            <div className="form-group">
              <label><FileText size={16} /> Order Note (optional)</label>
              <textarea className="textarea" rows={3} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
            </div>
          </section>

          {/* ----  RIGHT: ORDER SUMMARY  ---- */}
          <aside>
            <div className="order-summary">
              <h3 style={{ marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
                <ShoppingBag size={20} color="#f97316" /> Order Summary
              </h3>

              {cart.map((item) => (
                <div key={`${item.productId}::${item.variantId || ''}`} className="summary-item" style={{ alignItems: "center", gap: ".75rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: ".4rem" }} />}
                    <span>{item.name} × {item.quantity}</span>
                  </span>
                  <span>LKR {item.price * item.quantity}</span>
                </div>
              ))}
              {orderError && (
                <p style={{ color: "#dc2626", fontWeight: 600, marginTop: ".75rem" }}>{orderError}</p>
              )}

              <div className="summary-item total">
                <span>Total</span>
                <span>LKR {total}</span>
              </div>

              <p className="delivery-note">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Door-delivery island-wide. Cash on delivery available.
              </p>
            </div>

            <button type="submit" className="place-order" disabled={placing}>{placing ? "Placing..." : "Place Order"}</button>
          </aside>
        </form>
      </div>
    </>
  );
}