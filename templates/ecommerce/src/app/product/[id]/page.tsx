"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductPage({ params }: any) {
  const { id } = params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/storefront/products`);
        const data = await res.json();
        const found = (data || []).find((p: any) => String(p.id) === String(id));
        setProduct(found || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push('/cart');
  };

  if (loading) return <div>Loading…</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button onClick={() => router.back()} className="mb-4">Back</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-100 flex items-center justify-center">{product.images && product.images[0] ? <img src={product.images[0].url} alt={product.name} /> : 'No image'}</div>
        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="text-xl font-bold mb-4">₹{product.price}</div>
          <button onClick={addToCart} className="px-4 py-2 bg-black text-white rounded">Add to cart</button>
        </div>
      </div>
    </div>
  );
}
