"use client";
import Link from "next/link";

export default function ProductCard({ product }: any) {
  const price = (product.price || 0).toFixed(2);
  return (
    <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 flex flex-col transition-all hover:scale-[1.02] hover:border-[#00d4ff]/40 hover:shadow-lg hover:shadow-[#00d4ff]/10">
      <div className="h-44 rounded-xl mb-4 flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(168,85,247,0.08))" }}>
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0].url} alt={product.name} className="max-h-full object-cover" />
        ) : (
          <span style={{ fontSize: 48 }}>📦</span>
        )}
      </div>
      <h3 className="font-bold text-white text-lg mb-1">{product.name}</h3>
      <p className="text-slate-400 text-sm mb-4 flex-1">{product.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <div className="text-2xl font-bold" style={{ color: "#00d4ff" }}>₹{price}</div>
        <Link href={`/product/${product.id}`}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 hover:opacity-90"
          style={{ backgroundColor: "#00d4ff", color: "#0e1417" }}>
          View →
        </Link>
      </div>
    </div>
  );
}
