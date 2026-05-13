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
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">BharatCMS Storefront</h1>
          <nav className="flex items-center gap-4">
            <Link href="/cart" className="px-3 py-2 rounded bg-black text-white">Cart</Link>
          </nav>
        </header>

        <section>
          <h2 className="text-xl font-medium mb-4">Products</h2>

          {loading ? (
            <div>Loading…</div>
          ) : products.length === 0 ? (
            <div>No products found.</div>
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
