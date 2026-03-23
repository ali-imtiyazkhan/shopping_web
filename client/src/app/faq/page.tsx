"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "WHAT IS THE VOREN PHILOSOPHY?",
    answer: "VOREN is built on the principle of 'Architectural Minimalism'. We focus on the structural integrity of garments, using premium materials to create timeless pieces that transcend seasonal trends."
  },
  {
    question: "WHERE ARE YOUR PIECES MANUFACTURED?",
    answer: "All our primary collections are handcrafted in small-scale artisanal studios in Milan and Florence, Italy. We maintain direct relationships with our tailors to ensure the highest quality and ethical standards."
  },
  {
    question: "WHAT IS YOUR SHIPPING POLICY?",
    answer: "We offer complimentary express shipping globally on all orders over $500. For orders below this threshold, a flat rate of $25 applies. Delivery typically takes 3-5 business days via our luxury courier partners."
  },
  {
    question: "DO YOU OFFER PRIVATE FITTINGS?",
    answer: "Yes, we offer private digital and in-person fittings (Milan studio only). Please contact our assistance team to schedule a session with a VOREN stylist."
  },
  {
    question: "HOW DO I RETURN AN ITEM?",
    answer: "We offer a 14-day return window for all unworn items in their original packaging. Simply log into your account to request a complimentary courier pickup."
  }
];

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <section className="py-32 border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center space-y-6 mb-24">
            <span className="text-primary text-xs tracking-[0.5em] uppercase">Customer Concierge</span>
            <h1 className="text-5xl md:text-7xl font-serif">FAQ & ASSISTANCE</h1>
            <p className="text-foreground/40 font-light text-sm tracking-widest uppercase">Everything you need to know about VOREN</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border last:border-0">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full py-8 flex justify-between items-center text-left group"
                >
                  <span className={`text-xs tracking-[0.3em] font-medium transition-colors ${openIndex === index ? 'text-primary' : 'text-foreground/60 group-hover:text-foreground'}`}>
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-4 h-4 text-primary" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-foreground/30 group-hover:text-foreground" />
                  )}
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index ? "max-h-96 pb-12 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm text-foreground/50 font-light leading-relaxed max-w-2xl">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Details */}
      <section className="py-32 bg-card/10">
        <div className="container mx-auto px-6 max-w-4xl">
           <h2 className="text-3xl font-serif italic mb-16 text-center">Shipping & Logistics</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
             <div className="space-y-6">
               <h4 className="text-[10px] tracking-[0.4em] uppercase font-semibold text-primary">Domestic (EU)</h4>
               <p className="text-sm text-foreground/50 font-light leading-relaxed">
                 Express Shipping (1-2 Days): Complimentary<br />
                 Standard Shipping (3-5 Days): Complimentary
               </p>
             </div>
             <div className="space-y-6">
               <h4 className="text-[10px] tracking-[0.4em] uppercase font-semibold text-primary">International</h4>
               <p className="text-sm text-foreground/50 font-light leading-relaxed">
                 Global Express (3-5 Days): $25 (Free over $500)<br />
                 All duties and taxes are included at checkout.
               </p>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}

export default FAQPage;
