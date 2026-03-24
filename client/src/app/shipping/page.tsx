"use client";

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-16 border-b border-border pb-8">
          <h1 className="text-4xl font-serif tracking-[0.2em] uppercase mb-4">
            Shipping & Returns
          </h1>
          <p className="text-sm text-foreground/50 tracking-widest uppercase">
            Global Delivery & Refinement
          </p>
        </header>

        <div className="space-y-12 font-jost text-foreground/80 leading-relaxed tracking-wide">
          <section className="space-y-6">
            <h2 className="text-xl font-medium tracking-widest uppercase text-foreground">
              01. SHIPPING POLICY
            </h2>
            <div className="space-y-4">
              <p>
                VOREN provides worldwide shipping with a focus on speed and discretion. All orders are processed within 24-48 hours.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="border border-border p-6">
                  <h3 className="font-medium uppercase tracking-widest mb-2 text-foreground">Standard Delivery</h3>
                  <p className="text-sm">5-7 Business Days<br />Free on orders over $500</p>
                </div>
                <div className="border border-border p-6">
                  <h3 className="font-medium uppercase tracking-widest mb-2 text-foreground">Express Delivery</h3>
                  <p className="text-sm">1-3 Business Days<br />Available at checkout</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-medium tracking-widest uppercase text-foreground">
              02. RETURNS & EXCHANGES
            </h2>
            <p>
              We offer a 14-day return window for all unworn, unwashed items in their original packaging with tags attached.
            </p>
            <ul className="list-disc pl-6 space-y-4 text-sm">
              <li>Initiate a return by contacting assistance@voren.com with your order number.</li>
              <li>Returns are processed within 5 business days of receipt.</li>
              <li>Refunds will be issued to the original payment method.</li>
              <li>Exchange shipping is complimentary for domestic orders.</li>
            </ul>
          </section>

          <section className="space-y-6 text-sm text-foreground/50 italic border-t border-border pt-12">
            <p>
              Every VOREN piece is an investment. Our logistics team ensures it reaches you in pristine condition.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
