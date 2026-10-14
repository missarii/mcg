// src/components/Shop.jsx
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { api } from "../api";

export default function Shop({ searchQuery = "", addToCart, goToDetail }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await api.listProducts(searchQuery, true);
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [searchQuery]);

  if (loading) {
    return (
      <section className="section-gap" style={{ textAlign: "center", padding: "6rem 1rem" }}>
        <p>Loading products...</p>
      </section>
    );
  }

  return (
    <>
      <style>{`
        :root{
          --accent:#f97316;
          --accent-dark:#ea580c;
          --bg:#fafafa;
          --surface:#ffffff;
          --text:#111827;
          --text-muted:#6b7280;
          --radius:.75rem;
          --shadow-sm:0 1px 2px 0 rgba(0,0,0,.05);
          --shadow-md:0 4px 6px -1px rgba(0,0,0,.07),0 2px 4px -2px rgba(0,0,0,.07);
          --shadow-lg:0 10px 15px -3px rgba(0,0,0,.08),0 4px 6px -4px rgba(0,0,0,.08);
          --transition:.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes popIn{0%{opacity:0;transform:translateY(20px) scale(.96)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes floatUp{
          0%{transform:translateY(100vh) scale(.3);opacity:0}
          10%{opacity:.6}
          100%{transform:translateY(-120vh) scale(1.2);opacity:0}
        }
        .balloon{
          position:fixed;bottom:-10%;width:40px;height:40px;
          background:radial-gradient(circle at 30% 30%, #fff3, #fff0 60%),
                     radial-gradient(circle at 50% 50%, var(--accent), var(--accent-dark));
          border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;
          box-shadow:0 0 12px 2px var(--accent);
          pointer-events:none;animation:floatUp 20s linear infinite;
        }
        .balloon:nth-child(odd){animation-duration:25s;animation-delay:-5s;transform:scale(.8);}
        .balloon:nth-child(3n){animation-duration:18s;animation-delay:-12s;transform:scale(1.1);}
        .section-gap{padding:4rem 1rem;background:var(--bg);}
        .shop-header{display:flex;flex-direction:column;gap:1.5rem;margin-bottom:3rem;}
        .shop-header h2{font-size:2.5rem;font-weight:800;letter-spacing:-.02em;color:var(--text);}
        .filters{display:flex;gap:.6rem;flex-wrap:wrap;}
        .filter-pill{
          background:transparent;color:var(--text-muted);
          padding:.55rem 1.4rem;border-radius:999px;border:1.5px solid transparent;
          font-weight:600;cursor:pointer;position:relative;overflow:hidden;
          transition:color .3s,background .3s,box-shadow .3s;
        }
        .filter-pill::before{
          content:"";position:absolute;left:0;top:0;width:0;height:100%;
          background:linear-gradient(90deg,var(--accent),var(--accent-dark));
          transition:width .4s cubic-bezier(.77,0,.18,1);z-index:-1;
        }
        .filter-pill:hover{color:var(--surface);}
        .filter-pill:hover::before{width:100%;}
        .filter-pill.active{color:var(--surface);background:var(--accent);box-shadow:var(--shadow-md);}
        .grid-4{
          display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;
        }
        .grid-4 > *{animation:popIn .6s both cubic-bezier(.4,0,.2,1);}
        .grid-4 > *:nth-child(1){animation-delay:.05s;}
        .grid-4 > *:nth-child(2){animation-delay:.10s;}
        .grid-4 > *:nth-child(3){animation-delay:.15s;}
        .grid-4 > *:nth-child(4){animation-delay:.20s;}
        .grid-4 > *:nth-child(5){animation-delay:.25s;}
        .grid-4 > *:nth-child(6){animation-delay:.30s;}
        .grid-4 > *:nth-child(7){animation-delay:.35s;}
        .grid-4 > *:nth-child(8){animation-delay:.40s;}
        @media (max-width:1024px){.grid-4{grid-template-columns:repeat(2,1fr);}}
        @media (max-width:640px){.grid-4{grid-template-columns:1fr;}}
      `}</style>

      {/* Floating balloons */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="balloon" style={{ left: `${Math.random() * 100}%` }} />
      ))}

      <section className="section-gap">
        <div className="shop-header">
          <h2>All Products</h2>
          <div className="filters">
            <button className="filter-pill active">All</button>
            <button className="filter-pill">Hot</button>
            <button className="filter-pill">New</button>
          </div>
        </div>

        <div className="grid-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={(prod, variant) => addToCart(prod, variant)}
              goToDetail={goToDetail}
            />
          ))}
        </div>
      </section>
    </>
  );
}