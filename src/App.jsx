// src/App.jsx
'use client';
import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import { api } from "./api";
import { CART_KEY, cartKey } from "./cart";
import Home from "./components/Home";
import Shop from "./components/Shop";
import About from "./components/About";
import Contact from "./components/Contact";
import AdminPanel from "./components/AdminPanel";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import ProductDetail from "./components/ProductDetail";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isAdmin] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load live catalog from the NestJS + MongoDB backend (single server)
  useEffect(() => {
    let live = true;
    api.listProducts('', false)
      .then((data) => { if (live) setProducts(data || []); })
      .catch((err) => {
        console.error('Failed to load products from API:', err);
        if (live) setProducts([]);
      });
    return () => { live = false; };
  }, []);

  // Sync URL with currentPage
  useEffect(() => {
    const pageMap = {
      home: "/",
      shop: "/shop",
      about: "/about",
      contact: "/contact",
      admin: "/admin",
      cart: "/cart",
      checkout: "/checkout"
    };
    const path = pageMap[currentPage] || "/";
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
  }, [currentPage]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const pageMap = {
        "/": "home",
        "/shop": "shop",
        "/about": "about",
        "/contact": "contact",
        "/admin": "admin",
        "/cart": "cart",
        "/checkout": "checkout"
      };
      const page = pageMap[path];
      if (page) {
        setCurrentPage(page);
      } else if (path.startsWith("/product/")) {
        const id = String(path.split("/product/")[1]);
        const product = products.find(p => String(p.id) === id);
        if (product) {
          setSelectedProduct(product);
          setCurrentPage("detail");
        } else {
          setCurrentPage("home");
          window.history.pushState({}, "", "/");
        }
      } else {
        setCurrentPage("home");
        window.history.pushState({}, "", "/");
      }
    };
    window.addEventListener("popstate", handlePopState);
    handlePopState(); // Initial load
    return () => window.removeEventListener("popstate", handlePopState);
  }, [products]);

  // Cart persists in localStorage (existing mechanism, v2 key for variant lines)
  // Migrates legacy v1 cart items ({id, name, ...}) to v2 lines once.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY));
      if (Array.isArray(saved)) { setCart(saved); return; }
      const legacy = JSON.parse(localStorage.getItem('mcg_cart') || '[]');
      if (Array.isArray(legacy) && legacy.length) {
        setCart(legacy.map((i) => ({
          productId: String(i.productId || i.id),
          variantId: i.variantId ? String(i.variantId) : '',
          sku: i.sku || '',
          productName: i.productName || i.name,
          variantName: i.variantName || '',
          name: i.name,
          image: i.image,
          price: Number(i.price),
          quantity: Number(i.quantity) || 1,
          maxStock: Number(i.maxStock ?? i.stock ?? 99),
        })));
      }
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* ignore */ }
  }, [cart]);

  // Add to cart — keyed by productId + variantId (NOT just product id).
  // line: { productId, variantId, sku, productName, variantName, name, image, price, quantity, maxStock }
  const addToCart = (product, variant = null, qty = 1) => {
    const v = variant || null;
    const stock = v ? Number(v.stock ?? 0) : Number(product.stock ?? 0);
    const soldOut = v ? !!(v.soldOut ?? stock <= 0) : !!product.soldOut;
    if (soldOut || stock <= 0) return;
    const line = {
      productId: String(product.id),
      variantId: v ? String(v.id || v._id) : '',
      sku: v?.sku || '',
      productName: product.name,
      variantName: v?.name || '',
      name: v ? `${product.name} — ${v.name}` : product.name,
      image: v?.image || product.image,
      price: Number(v ? v.price : product.price),
      quantity: Math.max(1, Math.min(qty, stock)),
      maxStock: stock,
    };
    const key = cartKey(line);
    setCart((prev) => {
      const existing = prev.find((i) => cartKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          cartKey(i) === key
            ? { ...i, quantity: Math.min(i.quantity + line.quantity, Math.max(i.maxStock, line.maxStock)), maxStock: Math.max(i.maxStock, line.maxStock), price: line.price, image: line.image, name: line.name }
            : i,
        );
      }
      return [...prev, line];
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Go to product detail
  const goToDetail = (product) => {
    setSelectedProduct(product);
    setCurrentPage("detail");
    window.history.pushState({}, "", `/product/${product.id}`);
  };

  // Update review & avgRating (local mirror; MongoDB is source of truth)
  const updateProductReview = (productId, newReview) => {
    setProducts(prev =>
      prev.map(p => {
        if (String(p.id) === String(productId)) {
          const updatedReviews = [...(p.reviews || []), newReview];
          const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return { ...p, reviews: updatedReviews, avgRating };
        }
        return p;
      })
    );
  };

  const navigate = (page, product = null) => {
    if (page === "detail" && product) {
      goToDetail(product);
    } else {
      setCurrentPage(page);
      if (product) setSelectedProduct(product);
    }
  };

  return (
    <>
      <Nav
        currentPage={currentPage}
        setCurrentPage={navigate}
        totalItems={totalItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        isAdmin={isAdmin}
      />
      <main className="container" style={{ padding: "2rem 1rem" }}>
        {currentPage === "home" && (
          <Home
            setCurrentPage={navigate}
            addToCart={addToCart}
            goToDetail={goToDetail}
          />
        )}
        {currentPage === "shop" && (
          <Shop
            searchQuery={searchQuery}
            addToCart={addToCart}
            goToDetail={goToDetail}
          />
        )}
        {currentPage === "about" && <About />}
        {currentPage === "contact" && <Contact />}
        {currentPage === "admin" && isAdmin && (
          <AdminPanel setCurrentPage={navigate} />
        )}
        {currentPage === "cart" && (
          <CartPage cart={cart} setCart={setCart} setCurrentPage={navigate} />
        )}
        {currentPage === "checkout" && (
          <CheckoutPage cart={cart} setCart={setCart} setCurrentPage={navigate} />
        )}
        {currentPage === "detail" && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            addToCart={addToCart}
            setCurrentPage={navigate}
            updateProductReview={updateProductReview} // NEW: pass review updater
          />
        )}
      </main>
    </>
  );
}
