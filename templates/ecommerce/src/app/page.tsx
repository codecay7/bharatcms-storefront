"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./components/ProductCard";

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  images?: Array<any>;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/storefront/products`);
        const data = await res.json();
        setProducts(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0e1417" }}>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white">BharatCMS Store 🇮🇳</h1>
            <p className="text-slate-400 text-sm mt-1">Made for Indian developers</p>
          </div>
          <Link href="/store/cart"
            className="px-4 py-2 rounded-xl text-sm font-bold border border-white/10 text-white transition-all hover:border-[#00d4ff]/40"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}>
            �� Cart
          </Link>
        </header>

        <section>
          <h2 className="text-xl font-bold text-white mb-6">Products</h2>
          {loading ? (
            <div className="text-slate-400">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-slate-400">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
