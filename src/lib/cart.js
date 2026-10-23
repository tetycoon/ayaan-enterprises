export const CART_STORAGE_KEY = "chair_cart_selection_v1";

export const CATALOGUE = [
  {
    id: "ergo-hb",
    name: "Ergonomic High-Back Chair",
    cat: "Ergonomic",
    img: "/images/products/ergonomic-highback-black.jpg",
    white: true,
    price: null,
    features: ["Adjustable headrest", "3D armrests", "Synchro tilt with lock"]
  },
  {
    id: "exec-lth",
    name: "Executive Leatherette Chair",
    cat: "Executive",
    img: "/images/products/executive-leatherette-black.jpg",
    white: true,
    price: null,
    features: ["High back with headrest", "Chrome arms & base", "Padded leatherette"]
  },
  {
    id: "mesh-task",
    name: "Mesh Back Task Chair",
    cat: "Mesh",
    img: "/images/products/mesh-midback-black.png",
    white: true,
    price: null,
    features: ["Breathable mesh back", "Cushioned fabric seat", "Height adjustable"]
  },
  {
    id: "ergo-pro",
    name: "Pro Ergonomic Mesh Chair",
    cat: "Ergonomic",
    img: "/images/products/mesh-highback-grey-chrome.jpg",
    white: true,
    price: null,
    features: ["Adjustable lumbar support", "Headrest & 3D arms", "Ideal for long hours"]
  },
  {
    id: "task-compact",
    name: "Compact Office Chair",
    cat: "Mesh",
    img: "/images/products/compact-lowback-black.jpg",
    white: true,
    price: null,
    features: ["Space-saving design", "Fixed arms", "Smooth castors"]
  },
  {
    id: "wait-3",
    name: "3-Seater Waiting Chair",
    cat: "Visitor & waiting",
    img: "/images/chairs-waiting.jpg",
    price: null,
    features: ["Steel beam frame", "Cushioned seat & back", "2, 3 or 4 seater"]
  },
  {
    id: "audi",
    name: "Auditorium Seating",
    cat: "Auditorium",
    img: "/images/chairs-auditorium.jpg",
    price: null,
    features: ["Plush fabric seats", "Armrests with cup holder", "Fixed row installation"]
  },
  {
    id: "pantry",
    name: "Pantry Chair",
    cat: "Pantry",
    img: "/images/chair-pantry.jpg",
    white: true,
    price: null,
    features: ["Moulded shell with padded seat", "Office pantry & staff dining", "Sturdy powder-coated steel legs"]
  }
];

export function getStoredCart() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStoredCart(cart) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("chair_cart_updated", { detail: cart }));
  } catch (e) {
    console.error("Cart save error", e);
  }
}

export function clearStoredCart() {
  saveStoredCart({});
}

export function getCartSummary(cart) {
  const items = Object.entries(cart || {})
    .filter(([_, qty]) => Number(qty) > 0)
    .map(([id, qty]) => {
      const match = CATALOGUE.find((c) => c.id === id);
      return {
        id,
        name: match ? match.name : id,
        qty: Number(qty)
      };
    });

  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const textSummary = items.map((i) => `${i.qty}x ${i.name}`).join(", ");
  const typesList = items.map((i) => i.name);

  return {
    items,
    totalQty,
    textSummary,
    typesList
  };
}
