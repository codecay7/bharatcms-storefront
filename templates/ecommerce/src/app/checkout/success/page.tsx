import React from "react";

export default function Success() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Payment success</h1>
      <p>Your order was successful. The invoice will be emailed to you (if available).</p>
      <p className="mt-4"><a href="/">Back to store</a></p>
    </div>
  );
}
