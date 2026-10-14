export const CART_KEY = 'mcg_cart_v2';

export function cartKey(item) {
  return `${item.productId}::${item.variantId || ''}`;
}

export function displayName(item) {
  return item.variantName ? `${item.productName} — ${item.variantName}` : item.productName;
}

/** Max purchasable qty for a cart line given fresh product data. */
export function maxQtyForLine(line, products) {
  const p = (products || []).find((x) => String(x.id) === String(line.productId));
  if (!p) return line.quantity;
  if (line.variantId) {
    const v = (p.variants || []).find((x) => String(x.id || x._id) === String(line.variantId));
    if (!v) return 0;
    return Math.max(0, Number(v.stock ?? 0));
  }
  return Math.max(0, Number(p.stock ?? 0));
}