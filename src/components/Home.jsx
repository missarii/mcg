// src/components/Home.jsx
import { useState, useEffect } from "react";
import {
  Truck,
  Shield,
  CreditCard,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { api } from "../api";

export default function Home({ setCurrentPage, addToCart, goToDetail }) {
  /* --------------- STATE --------------- */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideIdx, setSlideIdx] = useState(0);

  /* --------------- FETCH FROM NESTJS API --------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.listProducts('', true);
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  /* --------------- AUTO-SLIDE --------------- */
  useEffect(() => {
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  /* --------------- HELPERS --------------- */
  const topRatedProducts = [...products].sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  const heroImages = [
    "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1605883705077-8d3d3cebe78c?auto=format&fit=crop&w=1600&q=80",
  ];

  if (loading) {
    return (
      <div className="section-gap" style={{ textAlign: "center", padding: "6rem 1rem" }}>
        <p>Loading Amani Collection...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes shimmer{0%{background-position:-1000px 0}100%{background-position:1000px 0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes popIn{0%{opacity:0;transform:translateY(20px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}
        .hero{position:relative;height:26rem;border-radius:1.2rem;overflow:hidden;background:#fbbf24;background-image:linear-gradient(110deg,#fb923c 0%,#fbbf24 50%,#fb923c 100%);background-size:200% 100%;animation:shimmer 3s infinite linear;}
        .hero-overlay{position:absolute;inset:0;background:rgba(0,0,0,.25);}
        .hero-content{position:relative;z-index:10;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:#fff;padding:1rem;}
        .hero-title{font-size:3.5rem;font-weight:800;margin-bottom:1rem;letter-spacing:-.02em;}
        .hero-subtitle{font-size:1.4rem;margin-bottom:2.2rem;}
        .hero-cta{background:#fff;color:#ea580c;padding:.85rem 2.4rem;border-radius:999px;font-weight:700;transition:all .3s;box-shadow:0 8px 30px -8px rgba(0,0,0,.25);}
        .hero-cta:hover{background:#fed7aa;transform:scale(1.08);}
        .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.8rem;}
        .section-title{font-size:2.25rem;font-weight:800;color:#1a1a1a;}
        .view-all{color:#f97316;font-weight:600;transition:color .3s;}
        .view-all:hover{color:#ea580c;}
        .features{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
        .feature-card{background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:2rem;border-radius:1.2rem;text-align:center;transition:transform .3s,box-shadow .3s;animation:float 4s ease-in-out infinite;}
        .feature-card:nth-child(2){background:linear-gradient(135deg,#eff6ff,#dbeafe);animation-delay:.5s;}
        .feature-card:nth-child(3){background:linear-gradient(135deg,#f3e8ff,#e9d5ff);animation-delay:1s;}
        .feature-card:hover{transform:translateY(-8px);box-shadow:0 12px 30px -10px rgba(0,0,0,.15);}
        .feature-icon{width:3.5rem;height:3.5rem;margin:0 auto 1rem;}
        .green{color:#10b981;}.blue{color:#3b82f6;}.purple{color:#8b5cf6;}
        .feature-title{font-weight:700;font-size:1.25rem;margin-bottom:.5rem;}
        .feature-desc{color:#4b5563;}
        .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.8rem;}
        .grid-3 > *{animation:popIn .6s both cubic-bezier(.4,0,.2,1);}
        .grid-3 > *:nth-child(1){animation-delay:.05s;}
        .grid-3 > *:nth-child(2){animation-delay:.10s;}
        .grid-3 > *:nth-child(3){animation-delay:.15s;}
        .grid-3 > *:nth-child(4){animation-delay:.20s;}
        @media (max-width:768px){
          .hero-title{font-size:2.5rem;}
          .features{grid-template-columns:1fr;}
          .grid-3{grid-template-columns:1fr;}
        }
        .slider{position:relative;height:26rem;border-radius:1.2rem;overflow:hidden;}
        .slide{position:absolute;inset:0;background-size:cover;background-position:center;transition:opacity 1s;}
        .slide:not(.active){opacity:0;}
        .slider-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.8);border:none;padding:.6rem;border-radius:999px;cursor:pointer;z-index:10;}
        .slider-btn.left{left:1rem;}.slider-btn.right{right:1rem;}
        .story{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;margin:5rem 0;}
        .story-text h3{font-size:2.2rem;font-weight:800;margin-bottom:1rem;}
        .story-text p{color:#4b5563;line-height:1.7;}
        .story-img{width:100%;border-radius:1.2rem;}
        .testimonials{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem;margin:4rem 0;}
        .tcard{background:#fff;border:1px solid #e5e7eb;padding:2rem;border-radius:1.2rem;box-shadow:0 4px 20px -10px rgba(0,0,0,.08);}
        .stars{display:flex;gap:.2rem;color:#f59e0b;margin-bottom:.8rem;}
        .tcard p{font-style:italic;color:#374151;margin-bottom:1rem;}
        .tcard .name{font-weight:700;color:#1f2937;}
        .newsletter{background:linear-gradient(135deg,#fef3c7,#fde68a);padding:4rem 2rem;border-radius:1.2rem;text-align:center;margin:4rem 0;}
        .newsletter h3{font-size:2rem;font-weight:800;margin-bottom:1rem;}
        .newsletter form{display:flex;max-width:500px;margin:1.5rem auto 0;}
        .newsletter input{flex:1;padding:.8rem 1rem;border:none;border-radius:999px 0 0 999px;font-size:1rem;}
        .newsletter button{background:#ea580c;color:#fff;border:none;padding:0 2rem;border-radius:0 999px 999px 0;font-weight:700;cursor:pointer;transition:background .3s;}
        .newsletter button:hover{background:#c2410c;}
        .footer{background:#111827;color:#e5e7eb;padding:3rem 2rem 2rem;border-radius:1.2rem 1.2rem 0 0;margin-top:4rem;}
        .footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2rem;}
        .footer h4{font-weight:700;margin-bottom:1rem;}
        .footer a{color:#9ca3af;text-decoration:none;display:block;margin-bottom:.5rem;}
        .footer a:hover{color:#fff;}
        .footer-bottom{text-align:center;margin-top:2rem;font-size:.8rem;color:#6b7280;}
      `}</style>

      <div className="section-gap">

        {/* HERO SLIDER */}
        <section className="slider">
          {heroImages.map((src, i) => (
            <div key={src} className={`slide ${i === slideIdx ? "active" : ""}`} style={{ backgroundImage: `url(${src})` }} />
          ))}
          <button className="slider-btn left" onClick={() => setSlideIdx((i) => (i - 1 + 3) % 3)}>
            <ChevronLeft />
          </button>
          <button className="slider-btn right" onClick={() => setSlideIdx((i) => (i + 1) % 3)}>
            <ChevronRight />
          </button>
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1 className="hero-title">Authentic Sri Lankan Crafts</h1>
            <p className="hero-subtitle">Handmade with Love by Amani Collection</p>
            <button onClick={() => setCurrentPage("shop")} className="hero-cta">Shop Now</button>
          </div>
        </section>

        {/* TOP-RATED PRODUCTS */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Top Rated Products</h2>
            <button onClick={() => setCurrentPage("shop")} className="view-all">View All</button>
          </div>
          <div className="grid-3">
            {topRatedProducts.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} onAdd={(prod, variant) => addToCart(prod, variant)} goToDetail={goToDetail} />
            ))}
          </div>
        </section>

        {/* OUR STORY */}
        <section className="story">
          <div className="story-text">
            <h3>From Generation to Generation</h3>
            <p>
              Amani Collection was born in a tiny village workshop where the scent of cane and fresh
              wood-shavings still lingers in the air. Every basket, every carving, every vibrant
              batik is a story passed from grandmother to mother to daughter.
            </p>
            <p>
              When you hold one of our pieces you are holding 150 years of Sri Lankan sunshine,
              monsoon rain, laughter and lullabies. Thank you for keeping the story alive.
            </p>
            <button onClick={() => setCurrentPage("about")} className="hero-cta" style={{ marginTop: "1.5rem" }}>
              Read Our Journey
            </button>
          </div>
          <img
            className="story-img"
            src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80"
            alt="Artisan weaving"
          />
        </section>

        {/* FEATURES */}
        <section className="features">
          <div className="feature-card">
            <Truck className="feature-icon green" />
            <h3 className="feature-title">Free Island-wide Delivery</h3>
            <p className="feature-desc">On orders over LKR 5000</p>
          </div>
          <div className="feature-card">
            <Shield className="feature-icon blue" />
            <h3 className="feature-title">100% Authentic</h3>
            <p className="feature-desc">Handmade by local artisans</p>
          </div>
          <div className="feature-card">
            <CreditCard className="feature-icon purple" />
            <h3 className="feature-title">Secure Payment</h3>
            <p className="feature-desc">Cash on delivery available</p>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section>
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="testimonials">
            {[
              { name: "Amasha Perera", text: "The basket set is even more beautiful in real life. You can feel the love that went into every weave." },
              { name: "Nadun Ekanayake", text: "Ordered on Monday, arrived on Wednesday. Packaging was plastic-free and the gift note was handwritten. Class!" },
              { name: "Tharushi De Silva", text: "Finally a shop that celebrates our heritage without making it look old-fashioned. Already placed my third order." },
            ].map((t) => (
              <div className="tcard" key={t.name}>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <Quote size={20} className="text-amber-500 mb-2" />
                <p>“{t.text}”</p>
                <div className="name">— {t.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="newsletter">
          <h3>Join the Amani family</h3>
          <p>Get early access to new drops, artisan stories and secret discounts.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you! We will be in touch soon.");
              e.target.reset();
            }}
          >
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h4>Amani Collection</h4>
            <p style={{ color: "#9ca3af", fontSize: ".9rem" }}>
              Celebrating Sri Lankan craftsmanship since 1972.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <a onClick={() => setCurrentPage("shop")}>Shop All</a>
            <a onClick={() => setCurrentPage("about")}>About Us</a>
            <a onClick={() => setCurrentPage("contact")}>Contact</a>
            <a onClick={() => setCurrentPage("faq")}>FAQ</a>
          </div>
          <div>
            <h4>Help</h4>
            <a href="#">Shipping Info</a>
            <a href="#">Returns</a>
            <a href="#">Track Order</a>
            <a href="#">Care Instructions</a>
          </div>
          <div>
            <h4>Visit Us</h4>
            <a href="#">
              <MapPin size={14} style={{ display: "inline", marginRight: 6 }} />
              123 Kandy Road, Kurunegala
            </a>
            <a href="tel:+94771234567">
              <Phone size={14} style={{ display: "inline", marginRight: 6 }} />
              +94 77 123 45 67
            </a>
            <a href="mailto:hello@amani.lk">
              <Mail size={14} style={{ display: "inline", marginRight: 6 }} />
              hello@amani.lk
            </a>
            <div style={{ marginTop: "1rem", display: "flex", gap: ".8rem" }}>
              <Facebook size={20} />
              <Instagram size={20} />
              <Twitter size={20} />
            </div>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} Amani Collection. All rights reserved.</div>
      </footer>
    </>
  );
}