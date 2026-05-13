"use client";

import { useRouter } from "next/navigation";

export default function useRazorpay() {
  const router = useRouter();

  const loadScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openCheckout = async ({ amount, planName, userEmail, userName, tenantId, onSuccess, onFailure }: any) => {
    const loaded = await loadScript();
    if (!loaded) {
      onFailure && onFailure('Failed to load Razorpay');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/storefront/orders/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount/100, total: amount/100, subtotal: amount/100, items: [], tenant: tenantId })
      });
      const data = await res.json();
      const orderId = data.razorpay_order_id || data.order_id || data.id;

      if (!orderId) {
        onFailure && onFailure('Failed to create order');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount || amount,
        currency: 'INR',
        name: 'BharatCMS',
        description: `${planName}`,
        order_id: orderId,
        prefill: { name: userName || '', email: userEmail || '', contact: '' },
        theme: { color: '#00d4ff' },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/storefront/orders/verify`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              onSuccess && onSuccess(response.razorpay_payment_id, planName);
            } else {
              onFailure && onFailure(verifyData.message || 'Verification failed');
            }
          } catch (e) {
            onFailure && onFailure('Verification request failed');
          }
        },
        modal: { ondismiss: () => onFailure && onFailure('Payment cancelled') },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      onFailure && onFailure('An error occurred during checkout initialization');
    }
  };

  return { openCheckout };
}
