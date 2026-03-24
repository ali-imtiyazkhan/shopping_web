"use client";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-16 border-b border-border pb-8">
          <h1 className="text-4xl font-serif tracking-[0.2em] uppercase mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-foreground/50 tracking-widest uppercase">
            Updated: January 2026
          </p>
        </header>

        <div className="space-y-12 font-jost text-foreground/80 leading-relaxed tracking-wide">
          <section className="space-y-6">
            <h2 className="text-xl font-medium tracking-widest uppercase text-foreground">
              01. OVERVIEW
            </h2>
            <p>
              This website is operated by VOREN. Throughout the site, the terms “we”, “us” and “our” refer to VOREN. VOREN offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-medium tracking-widest uppercase text-foreground">
              02. ONLINE STORE TERMS
            </h2>
            <p>
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-medium tracking-widest uppercase text-foreground">
              03. GENERAL CONDITIONS
            </h2>
            <p>
              We reserve the right to refuse service to any person for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-medium tracking-widest uppercase text-foreground">
              04. MODIFICATIONS TO THE SERVICE AND PRICES
            </h2>
            <p>
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
            </p>
          </section>

          <section className="space-y-6 text-sm text-foreground/50 italic border-t border-border pt-12">
            <p>
              Questions about the Terms of Service should be sent to us at assistance@voren.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
