"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  return (
    <div className="min-h-screen relative overflow-x-hidden flex items-center justify-center" style={{ backgroundColor: "#0e1417" }}>
      <div className="pointer-events-none fixed top-0 right-0 w-96 h-96 rounded-full opacity-[0.15]"
        style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)", filter: "blur(100px)", transform: "translate(30%, -30%)" }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(90px)", transform: "translate(-30%, 30%)" }} />
      <div className="relative z-10 text-center max-w-md w-full px-4">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full opacity-30 animate-ping"
              style={{ background: "rgba(0,212,255,0.3)", animationDuration: "2s" }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))",
                border: "2px solid rgba(0,212,255,0.3)",
                boxShadow: "0 0 40px rgba(0,212,255,0.15)",
              }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20l7 7 13-14" stroke="#a8e8ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: "#dde3e7", letterSpacing: "-0.02em" }}>
          Payment Successful!
        </h1>
        <p className="text-sm mb-6" style={{ color: "#859398" }}>
          Your GST invoice has been generated and will be available shortly.
        </p>
        {orderId && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-8"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#3c494e" }}>Order ID</span>
            <span className="text-sm font-mono font-bold" style={{ color: "#a8e8ff" }}>{orderId}</span>
          </div>
        )}
        <div className="flex flex-col gap-3">
          {orderId && (
            <a
              href={strapiUrl + "/api/invoices/" + orderId + "/download"}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-sm transition-all active:scale-95"
              style={{
                background: "#a8e8ff",
                color: "#001f27",
                border: "2px solid rgba(255,255,255,0.2)",
                boxShadow: "4px 4px 0px 0px rgba(0,212,255,1)",
              }}>
              <span>📄</span> Download Invoice
            </a>
          )}
          <Link href="/store"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-sm transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#bbc9cf",
              border: "1px solid rgba(255,255,255,0.09)",
            }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Success() {
  return <Suspense><SuccessContent /></Suspense>;
}
