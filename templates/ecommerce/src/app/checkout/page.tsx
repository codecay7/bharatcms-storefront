"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useRazorpay from "../hooks/useRazorpay";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { openCheckout } = useRazorpay();

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(c);
  }, []);

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);

  const onPay = async () => {
    setLoading(true);
    try {
      // call backend to create order
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/storefront/orders/create`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ items: cart, subtotal: total, total, tenant: null })
      });
      const data = await res.json();
      if (!data.razorpay_order_id) throw new Error('No order id');

      openCheckout({
        amount: data.amount || Math.round(total * 100),
        planName: 'purchase',
        userEmail: '',
        userName: '',
        tenantId: null,
        onSuccess: async (paymentId) => {
          // redirect to success
          localStorage.removeItem('cart');
          router.push('/checkout/success');
        },
        onFailure: (err) => {
          alert('Payment failed: ' + err);
        }
      });
    } catch (e) {
      console.error(e);
      alert('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      {cart.length === 0 ? <div>Your cart is empty</div> : (
        <div>
          <ul>
            {cart.map((it, i) => (
              <li key={i} className="flex items-center justify-between py-2 border-b">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-600">Qty: {it.qty}</div>
                </div>
                <div className="font-semibold">₹{(it.price||0).toFixed(2)}</div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <div className="font-semibold">Total: ₹{total.toFixed(2)}</div>
            <div>
              <button onClick={onPay} disabled={loading} className="px-4 py-2 bg-black text-white rounded">{loading ? 'Processing…' : 'Pay'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
