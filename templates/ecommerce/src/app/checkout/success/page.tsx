"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0e1417" }}>
      <div className="text-center max-w-md px-4">
        <div style={{ fontSize: 72 }}>✅</div>
        <h1 className="text-3xl font-bold text-white mt-6 mb-3">Payment Successful!</h1>
        {orderId && (
          <p className="text-slate-400 text-sm mb-6">Order ID: <span className="text-white font-mono">{orderId}</span></p>
        )}
        <p className="text-slate-400 mb-8">Your GST invoice has been generated and will be available shortly.</p>
        <div className="flex flex-col gap-3">
          {orderId && (
            <a href={`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/invoices/${orderId}/download`}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{ backgroundColor: "#00d4ff", color: "#0e1417" }}>
              📄 Download Invoice
            </a>
          )}
          <Link href="/store" className="w-full py-3 rounded-xl font-bold text-sm border border-white/10 text-white text-center"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Success() {
  return <Suspense><SuccessContent /></Suspense>;
}
