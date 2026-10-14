// src/components/AdminPanel.jsx
import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { api, getToken } from "../api";

const ACCEPT = "image/jpeg,image/png,image/webp";
const MAX_BYTES = 5 * 1024 * 1024;

const blankVariant = () => ({
  key: `tmp-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  id: "",
  name: "",
  sku: "",
  image: "",
  imageFile: null,
  preview: "",
  price: "",
  stock: "",
  description: "",
});

function validImage(file) {
  if (!file) return "Please choose an image.";
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return "Only JPG, JPEG, PNG and WebP images are allowed.";
  if (file.size > MAX_BYTES) return "Image must be 5MB or smaller.";
  return "";
}

function filePreview(file, cb) {
  const reader = new FileReader();
  reader.onload = () => cb(reader.result);
  reader.readAsDataURL(file);
}

function VariantEditor({ variants, patchVariant, onFile, onRemove, fileRefs, accept }) {
  if (!variants.length) return null;
  return (
    <div className="full" style={{ marginBottom: "1rem" }}>
      <h3 style={{ margin: "0 0 .75rem", fontSize: "1.05rem" }}>Variants <span style={{ color: "#6b7280" }}>({variants.length})</span></h3>
      {variants.map((v, idx) => (
        <div key={v.key} className="variant-block">
          <div className="variant-head">
            <strong>Variant {idx + 1}{v.sku ? ` — ${v.sku}` : ""}</strong>
            <button type="button" className="del-btn" onClick={() => onRemove(v.key)}>Remove</button>
          </div>
          <div className="form-grid" style={{ marginBottom: 0 }}>
            <div>
              <label className="field-label">Variant name</label>
              <input className="input" placeholder="e.g. 5mm Pencil" value={v.name} onChange={(e) => patchVariant(v.key, { name: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">SKU (unique)</label>
              <input className="input" placeholder="e.g. PENCIL-5MM" value={v.sku} onChange={(e) => patchVariant(v.key, { sku: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">Price (LKR)</label>
              <input className="input" placeholder="e.g. 100" type="number" min="0" value={v.price} onChange={(e) => patchVariant(v.key, { price: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">Stock</label>
              <input className="input" placeholder="e.g. 50" type="number" min="0" value={v.stock} onChange={(e) => patchVariant(v.key, { stock: e.target.value })} required />
            </div>
            <div className="full">
              <label className="field-label">Variant short description</label>
              <textarea className="textarea" rows={2} placeholder="Describe this variant…" value={v.description} onChange={(e) => patchVariant(v.key, { description: e.target.value })} />
            </div>
            <div className="full">
              <label className="field-label">Variant image (JPG / PNG / WebP, max 5MB)</label>
              <div className="upload-row">
                <input type="file" accept={accept} style={{ display: "none" }}
                  ref={(el) => { if (el) fileRefs.current[v.key] = el; }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(v.key, f); e.target.value = ""; }} />
                <button type="button" className="btn" onClick={() => fileRefs.current[v.key]?.click()}>
                  {(v.preview || v.image) ? "Replace variant image" : "Upload variant image"}
                </button>
                {(v.preview || v.image) && (
                  <img src={v.preview || v.image} alt={v.name || "variant"} className="preview-img" style={{ width: 64, height: 64 }} />
                )}
                {v.imageFile && <span className="file-name">{v.imageFile.name}</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPanel({ setCurrentPage }) {
  /* ---------- state ---------- */
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [soldOut, setSoldOut] = useState(false);
  const [variants, setVariants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [storedProducts, setStoredProducts] = useState([]);
  const mainFileRef = useRef(null);
  const variantFileRefs = useRef({});

  const refresh = async () => {
    try {
      const data = await api.listProducts('', false);
      setStoredProducts(data || []);
    } catch (e) { console.error(e); }
  };

  /* ---------- lifecycle ---------- */
  useEffect(() => { if (loggedIn) refresh(); }, [loggedIn]);

  // Keep session if a token already exists
  useEffect(() => {
    if (getToken()) setLoggedIn(true);
  }, []);

  /* ---------- handlers ---------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.login(username, password);
      setLoggedIn(true);
      setError("");
    } catch {
      setError("Invalid credentials");
    }
  };

  const resetForm = () => {
    setName(""); setImage(""); setImageFile(null); setImagePreview("");
    setDescription(""); setPrice(""); setStock(""); setSoldOut(false);
    setVariants([]); setEditingId(null); setError(""); setNotice("");
  };

  const onMainFile = (file) => {
    const msg = validImage(file);
    if (msg) { setError(msg); return; }
    setError("");
    setImageFile(file);
    filePreview(file, setImagePreview);
  };

  const patchVariant = (key, patch) =>
    setVariants((prev) => prev.map((v) => (v.key === key ? { ...v, ...patch } : v)));

  const onVariantFile = (key, file) => {
    const msg = validImage(file);
    if (msg) { setError(msg); return; }
    setError("");
    filePreview(file, (preview) => patchVariant(key, { imageFile: file, preview }));
  };

  const addVariant = () => setVariants((prev) => [...prev, blankVariant()]);
  const removeVariant = (key) => setVariants((prev) => prev.filter((v) => v.key !== key));

  const validate = () => {
    if (!name.trim()) return "Product name is required.";
    if (Number(price) < 0 || Number(stock) < 0) return "Price and stock must be 0 or more.";
    if (!description.trim()) return "Short description is required.";
    const skus = new Set();
    for (const v of variants) {
      if (!v.name.trim()) return "Every variant needs a name.";
      if (!v.sku.trim()) return `Variant "${v.name || '?'}" needs a SKU.`;
      if (skus.has(v.sku.trim().toLowerCase())) return `Duplicate SKU "${v.sku}". Each variant needs a unique SKU.`;
      skus.add(v.sku.trim().toLowerCase());
      if (v.price === "" || Number(v.price) < 0) return `Variant "${v.name}" needs a valid price (0+).`;
      if (v.stock === "" || Number(v.stock) < 0) return `Variant "${v.name}" needs valid stock (0+).`;
    }
    return "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return; // prevent duplicate submissions
    const msg = validate();
    if (msg) { setError(msg); return; }
    setSaving(true);
    setError(""); setNotice("");
    try {
      const payload = {
        name: name.trim(), image, imageFile,
        description: description.trim(), price: Number(price), stock: Number(stock),
        soldOut, variants: variants.map((v) => ({ ...v, sku: v.sku.trim() })),
      };
      if (editingId) {
        const updated = await api.updateProduct(editingId, payload);
        setStoredProducts((prev) => prev.map((p) => (String(p.id) === String(editingId) ? updated : p)));
        setNotice("Product updated.");
      } else {
        const data = await api.createProduct(payload);
        setStoredProducts((prev) => [data, ...prev]);
        setNotice("Product created.");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      setError(String(err.message || "Failed to save product").replace(/^API \d+: /, ""));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(String(p.id));
    setName(p.name || ""); setImage(p.image || ""); setImageFile(null); setImagePreview("");
    setDescription(p.description || ""); setPrice(String(p.price ?? "")); setStock(String(p.stock ?? ""));
    setSoldOut(!!p.soldOut); setError(""); setNotice("");
    setVariants((p.variants || []).map((v) => ({
      key: String(v.id || v._id),
      id: String(v.id || v._id),
      name: v.name || "", sku: v.sku || "", image: v.image || "",
      imageFile: null, preview: "",
      price: String(v.price ?? ""), stock: String(v.stock ?? ""),
      description: v.description || "",
    })));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product and all its variants?")) return;
    try {
      await api.deleteProduct(id);
      setStoredProducts(storedProducts.filter((p) => String(p.id) !== String(id)));
      if (String(editingId) === String(id)) resetForm();
    } catch (e) { console.error(e); }
  };

  const handleToggleSoldOut = async (id) => {
    const product = storedProducts.find((p) => String(p.id) === String(id));
    try {
      const updated = await api.updateProduct(id, { soldOut: !product.soldOut });
      setStoredProducts(storedProducts.map((p) => (String(p.id) === String(id) ? updated : p)));
    } catch (e) { console.error(e); }
  };

  const handleUpdateStock = async (id, val) => {
    if (val < 0) return;
    try {
      const updated = await api.updateProduct(id, { stock: val });
      setStoredProducts(storedProducts.map((p) => (String(p.id) === String(id) ? updated : p)));
    } catch (e) { console.error(e); }
  };

  /* ---------------- LOGIN VIEW ---------------- */
  if (!loggedIn)
    return (
      <>
        <style>{`
          .login-root{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#ffffff;overflow:hidden;position:relative;}
          .login-card{width:100%;max-width:24rem;background:rgba(255,255,255,.9);border:1px solid rgba(0,0,0,.05);border-radius:1.25rem;box-shadow:0 25px 50px -12px rgba(0,0,0,.1);backdrop-filter:blur(12px);padding:2.5rem 2.2rem;transform:translateY(0);transition:transform .3s;z-index:10;}
          .login-card:hover{transform:translateY(-4px);}
          .sun-svg{position:absolute;top:50%;left:50%;width:320px;height:320px;transform:translate(-50%,-50%);z-index:0;animation:rotate 30s linear infinite;}
          .sun-disc{fill:url(#sunGradient);animation:pulse 4s ease-in-out infinite;}
          .sun-ray{stroke:url(#rayGradient);stroke-width:2.5;animation:pulse 4s ease-in-out infinite;}
          @keyframes rotate{to{transform:translate(-50%,-50%) rotate(360deg);}}
          @keyframes pulse{0%,100%{transform:scale(1);opacity:.55;}50%{transform:scale(1.08);opacity:.75;}}
          .login-title{text-align:center;font-size:1.8rem;font-weight:700;background:linear-gradient(90deg,#f97316,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:1.75rem;}
          .input-group{margin-bottom:1.25rem;}
          .input{width:100%;box-sizing:border-box;padding:.9rem 1rem;border:1px solid #fed7aa;border-radius:.65rem;background:rgba(255,255,255,.95);outline:none;font-size:1rem;transition:all .3s;}
          .input:focus{border-color:#f97316;box-shadow:0 0 0 3px rgba(249,115,22,.25);}
          .btn{width:100%;padding:.9rem;background:linear-gradient(90deg,#f97316,#fb923c);color:#fff;border:none;border-radius:.65rem;font-weight:600;font-size:1rem;cursor:pointer;transition:all .3s;box-shadow:0 4px 15px rgba(249,115,22,.3);margin-top:.5rem;}
          .btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(249,115,22,.4);}
          .error{color:#ef4444;text-align:center;margin-top:.75rem;font-size:.9rem;}
          .back-btn{display:inline-flex;align-items:center;gap:.5rem;background:none;border:none;color:#f97316;font-weight:500;cursor:pointer;margin-bottom:1.25rem;transition:color .3s;}
          .back-btn:hover{color:#fb923c;}
        `}</style>
        <div className="login-root">
          <svg className="sun-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FDB813"/>
                <stop offset="100%" stopColor="#FFA000"/>
              </radialGradient>
              <radialGradient id="rayGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD54F"/>
                <stop offset="100%" stopColor="#FF8F00"/>
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="20" fill="url(#sunGradient)" opacity=".15" />
            <circle className="sun-disc" cx="32" cy="32" r="12"/>
            <g className="sun-ray">
              <line x1="32" y1="0" x2="32" y2="10"/>
              <line x1="32" y1="54" x2="32" y2="64"/>
              <line x1="0" y1="32" x2="10" y2="32"/>
              <line x1="54" y1="32" x2="64" y2="32"/>
              <line x1="9.2" y1="9.2" x2="17.2" y2="17.2"/>
              <line x1="46.8" y1="46.8" x2="54.8" y2="54.8"/>
              <line x1="9.2" y1="54.8" x2="17.2" y2="46.8"/>
              <line x1="46.8" y1="17.2" x2="54.8" y2="9.2"/>
            </g>
          </svg>
          <div className="login-card">
            <button className="back-btn" onClick={() => setCurrentPage("home")}>
              <ArrowLeft size={18} /> Back to Home
            </button>
            <h2 className="login-title">Admin Portal</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="input-group">
                <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn">Sign In</button>
              {error && <p className="error">{error}</p>}
            </form>
          </div>
        </div>
      </>
    );

  /* ---------------- ADMIN PANEL VIEW ---------------- */
  const balloons = Array.from({ length: 12 }).map((_, i) => (
    <div
      key={i}
      className="balloon"
      style={{
        left: `${Math.random() * 100}%`,
        transform: `scale(${0.7 + Math.random() * 0.6})`,
        animationDelay: `${i * 0.8}s`,
        animationDuration: `${7 + Math.random() * 5}s`,
      }}
    />
  ));

  return (
    <>
      <style>{`
        .admin-root{min-height:100vh;background:#fffaf6;position:relative;overflow:hidden;font-family:'Inter',system-ui,sans-serif;}
        .top-wave{position:absolute;top:0;left:0;width:100%;height:120px;background-size:cover;z-index:0;pointer-events:none;}
        .admin-container{position:relative;z-index:1;max-width:64rem;margin:0 auto;padding:2.5rem 1.25rem 4rem;box-sizing:border-box;}
        .back-btn{display:inline-flex;align-items:center;gap:.5rem;background:none;border:none;color:#f97316;font-weight:600;cursor:pointer;margin-bottom:1.25rem;font-size:.95rem;padding:0;}
        h2.section-title{font-size:2rem;font-weight:800;background:linear-gradient(90deg,#f97316,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0 0 .4rem;}
        .section-sub{color:#6b7280;margin:0 0 1.5rem;font-size:.95rem;}
        .add-card{background:rgba(255,255,255,.88);border:1px solid rgba(254,215,170,.7);border-radius:1rem;box-shadow:0 10px 30px rgba(0,0,0,.06);padding:1.75rem;animation:slideUp .6s ease;box-sizing:border-box;}
        @keyframes slideUp{from{transform:translateY(30px);opacity:0;}to{transform:translateY(0);opacity:1;}}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:.9rem;margin-bottom:1.1rem;align-items:start;}
        @media(max-width:640px){.form-grid{grid-template-columns:1fr;}}
        .full{grid-column:1/-1;}
        .field-label{display:block;font-weight:600;font-size:.9rem;color:#374151;margin-bottom:.4rem;}
        .input,.textarea{width:100%;box-sizing:border-box;padding:.7rem .85rem;border:1px solid #fed7aa;border-radius:.65rem;background:rgba(255,255,255,.95);outline:none;font-size:.95rem;font-family:inherit;color:#111827;}
        .input:focus,.textarea:focus{border-color:#f97316;box-shadow:0 0 0 3px rgba(249,115,22,.2);}
        .textarea{resize:vertical;min-height:64px;}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;padding:.65rem 1.3rem;background:linear-gradient(90deg,#f97316,#fb923c);color:#fff;border:none;border-radius:.65rem;font-weight:600;font-size:.92rem;cursor:pointer;box-shadow:0 4px 15px rgba(249,115,22,.25);white-space:nowrap;}
        .btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 20px rgba(249,115,22,.35);}
        .btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}
        .btn.secondary{background:#6b7280;box-shadow:0 4px 15px rgba(107,114,128,.25);}
        .upload-row{display:flex;gap:.75rem;align-items:center;flex-wrap:wrap;}
        .preview-img{width:72px;height:72px;object-fit:cover;border-radius:.6rem;border:1px solid #fed7aa;background:#fff7ed;display:block;}
        .file-name{font-size:.8rem;color:#6b7280;word-break:break-all;}
        .variant-block{border:1px solid #fed7aa;border-radius:.75rem;padding:1rem;margin-bottom:.75rem;background:#fff;box-sizing:border-box;}
        .variant-head{display:flex;justify-content:space-between;align-items:center;gap:.75rem;margin-bottom:.7rem;flex-wrap:wrap;}
        .candy-switch{position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;}
        .candy-switch input{opacity:0;width:0;height:0;}
        .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#ccc;border-radius:24px;transition:.4s;}
        .slider:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background:white;border-radius:50%;transition:.4s;}
        input:checked+.slider{background:#22c55e;}
        input:checked+.slider:before{transform:translateX(20px);}
        .stock-stepper{display:flex;align-items:center;gap:.5rem;}
        .stepper-btn{width:26px;height:26px;border:1px solid #fed7aa;background:#fff;color:#f97316;border-radius:50%;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:.9rem;line-height:1;}
        .stepper-btn:hover{background:#f97316;color:#fff;}
        .stock-input{width:64px;text-align:center;padding:.3rem;border:1px solid #fed7aa;border-radius:.4rem;font-size:.9rem;}
        .table-wrap{margin-top:2rem;background:#fff;border:1px solid #ffe2c6;border-radius:1rem;box-shadow:0 10px 30px rgba(0,0,0,.05);overflow-x:auto;}
        table{width:100%;border-collapse:collapse;min-width:680px;}
        th{background:#fff7ed;color:#c2410c;padding:.75rem 1rem;text-align:left;font-size:.8rem;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;}
        td{padding:.75rem 1rem;border-top:1px solid #ffe2c6;font-size:.92rem;vertical-align:middle;}
        tbody tr:hover{background:#fffaf6;}
        .row-name{font-weight:600;display:flex;align-items:center;gap:.6rem;}
        .row-thumb{width:40px;height:40px;object-fit:cover;border-radius:.5rem;border:1px solid #ffe2c6;flex-shrink:0;background:#fff7ed;}
        .variant-cell{color:#6b7280;font-size:.85rem;max-width:230px;}
        .actions{display:flex;gap:.5rem;flex-wrap:wrap;}
        .edit-btn{background:#fff7ed;color:#ea580c;border:1.5px solid #fed7aa;padding:.35rem .8rem;border-radius:.45rem;font-size:.85rem;font-weight:600;cursor:pointer;white-space:nowrap;}
        .edit-btn:hover{background:#ffedd5;}
        .del-btn{background:#ef4444;color:#fff;border:none;padding:.35rem .8rem;border-radius:.45rem;font-size:.85rem;font-weight:600;cursor:pointer;white-space:nowrap;}
        .del-btn:hover{background:#dc2626;transform:translateY(-1px);}
        .error{color:#ef4444;text-align:center;margin-top:.75rem;font-size:.9rem;font-weight:500;}
        .notice{color:#059669;text-align:center;margin-top:.75rem;font-weight:600;}
        .form-actions{display:flex;gap:.75rem;margin-top:.75rem;flex-wrap:wrap;}
        .bg-balloons{position:absolute;inset:0;z-index:0;}
        .balloon{position:absolute;width:40px;height:50px;background:linear-gradient(135deg,#f97316,#fb923c);border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;opacity:.08;animation:float 10s ease-in-out infinite;}
        @keyframes float{0%,100%{transform:translateY(0) rotate(-2deg);}50%{transform:translateY(-25vh) rotate(2deg);}}
      `}</style>
      <div className="admin-root">
        <div className="bg-balloons">{balloons}</div>
        <div className="top-wave" />
        <div className="admin-container">
          <button className="back-btn" onClick={() => setCurrentPage("home")}>
            <ArrowLeft size={18} /> Back to Home
          </button>
          <h2 className="section-title">Control Centre</h2>
          <p className="section-sub">{editingId ? "Editing product — update details, images and variants, then save." : "Add products with local image uploads and optional variants."}</p>
          <div className="add-card">
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div>
                  <label className="field-label">Product name</label>
                  <input className="input" placeholder="e.g. Pencil" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="field-label">Price (LKR)</label>
                  <input className="input" placeholder="e.g. 50" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div>
                  <label className="field-label">Stock quantity</label>
                  <input className="input" placeholder="e.g. 100" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required />
                </div>
                <div>
                  <label className="field-label">Availability</label>
                  <label className="switch-row">
                    <span>Sold out</span>
                    <span className="candy-switch">
                      <input type="checkbox" checked={soldOut} onChange={(e) => setSoldOut(e.target.checked)} />
                      <span className="slider" />
                    </span>
                  </label>
                </div>
                <div className="full">
                  <label className="field-label">Product image (JPG / PNG / WebP, max 5MB)</label>
                  <div className="upload-row">
                    <input ref={mainFileRef} type="file" accept={ACCEPT} style={{ display: "none" }}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) onMainFile(f); e.target.value = ""; }} />
                    <button type="button" className="btn" onClick={() => mainFileRef.current?.click()}>
                      {imagePreview || image ? "Replace image" : "Upload image"}
                    </button>
                    {(imagePreview || image) && (
                      <img src={imagePreview || image} alt="preview" className="preview-img" />
                    )}
                    {imageFile && <span className="file-name">{imageFile.name}</span>}
                  </div>
                </div>
                <div className="full">
                  <label className="field-label">Short description</label>
                  <textarea className="textarea" rows={2} placeholder="Describe the product…" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
              </div>
              <VariantEditor variants={variants} patchVariant={patchVariant} onFile={onVariantFile} onRemove={removeVariant} fileRefs={variantFileRefs} accept={ACCEPT} />
              {error && <p className="error">{error}</p>}
              {notice && <p className="notice">{notice}</p>}
              <div className="form-actions">
                <button type="submit" className="btn" disabled={saving}>
                  {saving ? "Saving…" : editingId ? "Save changes" : "+ Add Product"}
                </button>
                {editingId && <button type="button" className="btn secondary" onClick={resetForm}>Cancel edit</button>}
              </div>
            </form>
          </div>
          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
            <button type="button" className="btn" onClick={addVariant}>+ Add Variant</button>
            {variants.length === 0 && (
              <span style={{ color: "#6b7280", fontSize: ".9rem" }}>No variants — single-item sale (existing behavior).</span>
            )}
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Variants</th>
                  <th>Sold out</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {storedProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="row-name">
                        {p.image && <img src={p.image} alt={p.name} className="row-thumb" />}
                        {p.name}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>LKR {p.price}</td>
                    <td>
                      <div className="stock-stepper">
                        <button className="stepper-btn" onClick={() => handleUpdateStock(p.id, p.stock - 1)}>−</button>
                        <input className="stock-input" type="number" min="0" value={p.stock} onChange={(e) => handleUpdateStock(p.id, Number(e.target.value))} />
                        <button className="stepper-btn" onClick={() => handleUpdateStock(p.id, p.stock + 1)}>+</button>
                      </div>
                    </td>
                    <td className="variant-cell">{(p.variants || []).length ? `${p.variants.length} (${p.variants.map((v) => `${v.name}:${v.stock}`).join(', ')})` : '—'}</td>
                    <td>
                      <label className="candy-switch">
                        <input type="checkbox" checked={!!p.soldOut} onChange={() => handleToggleSoldOut(p.id)} />
                        <span className="slider" />
                      </label>
                    </td>
                    <td>
                      <div className="actions" style={{ justifyContent: "flex-end" }}>
                        <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="del-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!storedProducts.length && (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "#6b7280" }}>No products yet — add your first product above.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}