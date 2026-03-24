"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-16 border-b border-border pb-8">
          <h1 className="text-4xl font-serif tracking-[0.2em] uppercase mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-foreground/50 tracking-widest uppercase">
            Updated: January 2026
          </p>
        </header>

        <div className="space-y-12 font-jost text-foreground/80 leading-relaxed tracking-wide">
          <section className="space-y-6">
            <h2 className="text-xl font-medium tracking-widest uppercase text-foreground">
              01. INFORMATION COLLECTION
            </h2>
            <p>
              VOREN collect information from you when you register on our site, place an order, subscribe to our newsletter or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address, phone number or credit card information.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-medium tracking-widest uppercase text-foreground">
              02. DATA USAGE
            </h2>
            <p>
              Any of the information we collect from you may be used in one of the following ways:
            </p>
            <ul className="list-disc pl-6 space-y-4">
              <li>To personalize your experience (your information helps us to better respond to your individual needs).</li>
              <li>To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you).</li>
              <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs).</li>
              <li>To process transactions.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-medium tracking-widest uppercase text-foreground">
              03. INFORMATION PROTECTION
            </h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems.
            </p>
          </section>

          <section className="space-y-6 text-sm text-foreground/50 italic border-t border-border pt-12">
            <p>
              Your privacy is of the utmost importance to VOREN. For any inquiries regarding our data practices, please contact us at assistance@voren.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
