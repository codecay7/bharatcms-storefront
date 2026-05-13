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
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: "#0e1417" }}>

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.12]"
        style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)", filter: "blur(100px)", transform: "translate(30%, -30%)" }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-96 h-96 rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(90px)", transform: "translate(-30%, 30%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto py-12 px-4">

        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-black tracking-tighter" style={{ color: "#ffffff" }}>BharatCMS</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-widest"
                style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#a8e8ff" }}>
                Store
              </span>
            </div>
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#3c494e" }}>
              Made for Indian developers 🇮🇳
            </p>
          </div>
          <Link href="/store/cart"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95"
            style={{
              background: "#a8e8ff",
              color: "#001f27",
              border: "2px solid rgba(255,255,255,0.2)",
              boxShadow: "4px 4px 0px 0px rgba(0,212,255,1)",
            }}>
            🛒 Cart
          </Link>
        </header>

        {/* Section heading */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-lg font-bold" style={{ color: "#dde3e7", letterSpacing: "-0.01em" }}>Products</h2>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          {!loading && (
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#3c494e" }}>
              {products.length} items
            </span>
          )}
        </div>

        {/* States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="h-48" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-4 w-2/3 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="h-3 w-full rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                  <div className="h-8 w-1/2 rounded mt-2" style={{ background: "rgba(0,212,255,0.08)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: 36 }}>📦</span>
            </div>
            <p className="text-sm font-medium" style={{ color: "#859398" }}>No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
