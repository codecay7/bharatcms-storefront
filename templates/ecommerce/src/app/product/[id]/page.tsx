"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/storefront/products`)
      .then(r => r.json())
      .then(data => {
        const found = data.find((p: any) => String(p.id) === String(id));
        setProduct(found || null);
      });
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.find((i: any) => i.id === product.id);
    if (!exists) cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
  };

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0e1417" }}>
      <p className="text-slate-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0e1417" }}>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Link href="/store" className="text-slate-400 hover:text-white text-sm mb-8 inline-block">← Back to Store</Link>
        <div className="p-8 rounded-2xl border border-white/10" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}>
          <div className="h-56 rounded-xl mb-6 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(168,85,247,0.08))" }}>
            <span style={{ fontSize: 64 }}>📦</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
          <p className="text-slate-400 mb-6">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold" style={{ color: "#00d4ff" }}>₹{product.price}</span>
            <button onClick={addToCart} disabled={added}
              className="px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: "#00d4ff", color: "#0e1417" }}>
              {added ? "✅ Added to Cart" : "Add to Cart"}
            </button>
          </div>
          {added && (
            <Link href="/store/cart" className="block text-center mt-4 text-sm" style={{ color: "#00d4ff" }}>
              Go to Cart →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
