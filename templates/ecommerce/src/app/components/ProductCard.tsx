"use client";

import Link from "next/link";

export default function ProductCard({ product }: any) {
  const price = (product.price || 0).toFixed ? product.price.toFixed(2) : product.price;

  return (
    <div className="border rounded p-4 bg-white">
      <div className="h-40 bg-gray-100 mb-3 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          // use first image url if present
          <img src={product.images[0].url || "/placeholder.png"} alt={product.name} className="max-h-full" />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
      <h3 className="font-medium text-lg mb-2">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">₹{price}</div>
        <Link href={`/product/${product.id}`} className="px-3 py-1 bg-black text-white rounded">View</Link>
      </div>
    </div>
  );
}
