"use client";

import Link from "next/link";

const footerLinks = {
  shop: [
    { name: "New Arrivals", href: "/listing?category=new" },
    { name: "Best Sellers", href: "/listing?category=best" },
    { name: "Ether Collection", href: "/listing?collection=ether" },
    { name: "Accessories", href: "/listing?category=accessories" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "Size Guide", href: "/faq#size-guide" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
  ],
};

function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-32 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-serif tracking-[0.3em]">
              VOREN
            </Link>
            <p className="text-sm text-foreground/50 font-light leading-relaxed max-w-xs">
              Architecting the future of minimalist menswear. A commitment to quality, ethics, and the art of less.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-6">
            <h4 className="text-xs tracking-[0.4em] uppercase font-medium">Collections</h4>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-foreground/50 hover:text-primary transition-colors tracking-widest uppercase">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-xs tracking-[0.4em] uppercase font-medium">Assistance</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-foreground/50 hover:text-primary transition-colors tracking-widest uppercase">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs tracking-[0.4em] uppercase font-medium">Connect</h4>
            <div className="space-y-4">
              <p className="text-xs text-foreground/50 tracking-widest leading-loose">
                VIA MONTENAPOLEONE, 27<br />
                20121 MILANO, ITALY
              </p>
              <p className="text-xs text-foreground/50 tracking-widest">
                ASSISTANCE@VOREN.COM
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="py-12 border-t border-border flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase">
             <div className="w-1 h-1 rounded-full bg-foreground"></div>
             <span>Secure Checkout</span>
           </div>
           <div className="flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase">
             <div className="w-1 h-1 rounded-full bg-foreground"></div>
             <span>Ethical Sourcing</span>
           </div>
           <div className="flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase">
             <div className="w-1 h-1 rounded-full bg-foreground"></div>
             <span>Luxury Guaranteed</span>
           </div>
        </div>

        <div className="pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] tracking-[0.3em] uppercase text-foreground/30">
          <p>© 2026 VOREN STUDIOS. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
            <a href="#" className="hover:text-foreground transition-colors">Pinterest</a>
            <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
