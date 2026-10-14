// Frontend API client — talks to the SAME NestJS server (single-server setup).
const TOKEN_KEY = 'mcg_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}
export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

async function req(path, options = {}) {
  const token = getToken();
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = { ...(options.headers || {}) };
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const normVariant = (v) => ({
  ...(v || {}),
  id: v?._id || v?.id,
  soldOut: !!(v?.soldOut ?? ((v?.stock ?? 1) <= 0)),
});

const norm = (p) => ({
  ...p,
  id: p._id || p.id,
  soldOut: p.soldOut ?? p.sold_out ?? false,
  avgRating: p.avgRating ?? p.avg_rating ?? 0,
  variants: Array.isArray(p.variants) ? p.variants.map(normVariant) : [],
});

export const api = {
  health: () => req('/api/health'),
  login: async (username, password) => {
    const data = await req('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(data.access_token);
    return data;
  },
  logout: () => setToken(''),
  listProducts: async (search = '', inStockOnly = true) => {
    const q = new URLSearchParams({ search, inStock: String(inStockOnly) });
    const data = await req(`/api/products?${q}`);
    return data.map(norm);
  },
  topRated: async () => (await req('/api/products/top-rated')).map(norm),
  getProduct: async (id) => norm(await req(`/api/products/${id}`)),
  /**
   * p: { name, image|imageFile, description, price, stock, soldOut, badge, variants[] }
   * imageFile (File) is uploaded first to /api/uploads/image → stored URL is saved.
   */
  uploadImage: async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return req('/api/uploads/image', { method: 'POST', body: fd });
  },
  resolveImage: async (image) => {
    if (image instanceof File) {
      const up = await api.uploadImage(image);
      return up.url;
    }
    return image || '';
  },
  createProduct: async (p) => {
    const image = await api.resolveImage(p.imageFile || p.image);
    const variants = await Promise.all(
      (p.variants || []).map(async (v) => ({
        _id: v.id && !String(v.id).startsWith('tmp-') ? v.id : undefined,
        name: v.name, sku: v.sku,
        image: await api.resolveImage(v.imageFile || v.image),
        price: Number(v.price), stock: Number(v.stock),
        description: v.description || '', soldOut: !!v.soldOut,
      })),
    );
    return norm(
      await req('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: p.name, image: image || 'https://via.placeholder.com/300',
          description: p.description, price: Number(p.price), stock: Number(p.stock),
          soldOut: !!(p.soldOut ?? p.sold_out), badge: p.badge || '', variants,
        }),
      }),
    );
  },
  updateProduct: async (id, p) => {
    const body = { ...p };
    if (body.imageFile instanceof File) body.image = await api.resolveImage(body.imageFile);
    delete body.imageFile;
    if (Array.isArray(body.variants)) {
      body.variants = await Promise.all(
        body.variants.map(async (v) => ({
          ...v,
          image: v.imageFile instanceof File ? await api.resolveImage(v.imageFile) : v.image,
          price: v.price === '' || v.price == null ? v.price : Number(v.price),
          stock: v.stock === '' || v.stock == null ? v.stock : Number(v.stock),
        })),
      );
      body.variants.forEach((v) => delete v.imageFile);
    }
    return norm(await req(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }));
  },
  deleteProduct: (id) => req(`/api/products/${id}`, { method: 'DELETE' }),
  getReviews: (productId) => req(`/api/products/${productId}/reviews`),
  addReview: (productId, { rating, text, author }) =>
    req(`/api/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify({ rating, text, author }) }),
  createOrder: (order) => req('/api/orders', { method: 'POST', body: JSON.stringify(order) }),
  sendMessage: (msg) => req('/api/messages', { method: 'POST', body: JSON.stringify(msg) }),
};
