"use client";

import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-32 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-6">
                <span className="text-primary text-xs tracking-[0.5em] uppercase">Assistance</span>
                <h1 className="text-5xl md:text-6xl font-serif">GET IN TOUCH</h1>
                <p className="text-foreground/50 font-light leading-relaxed">
                  Our concierges are available Monday leading through Friday, 9am — 6pm CET.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center space-x-6 group cursor-pointer">
                  <div className="p-4 rounded-full border border-border group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                    <Mail className="w-5 h-5 group-hover:text-black" />
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-1">Email</h4>
                    <p className="text-sm tracking-widest font-medium">ASSISTANCE@VOREN.COM</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 group cursor-pointer">
                  <div className="p-4 rounded-full border border-border group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                    <Phone className="w-5 h-5 group-hover:text-black" />
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-1">Phone</h4>
                    <p className="text-sm tracking-widest font-medium">+39 02 1234 5678</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 group cursor-pointer">
                  <div className="p-4 rounded-full border border-border group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                    <MapPin className="w-5 h-5 group-hover:text-black" />
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-1">Studio</h4>
                    <p className="text-sm tracking-widest font-medium uppercase leading-relaxed">
                      VIA MONTENAPOLEONE, 27<br />20121 MILANO, ITALY
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card/30 p-12 border border-border space-y-8">
              <h3 className="text-2xl font-serif italic">Send a Message</h3>
              <form className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50">Full Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50">Email Address</label>
                  <input type="email" className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="john@vanguard.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50">Message</label>
                  <textarea rows={4} className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm resize-none" placeholder="State your inquiry..." />
                </div>
                <Button className="w-full h-14 bg-foreground text-background rounded-none text-[10px] tracking-[0.4em] uppercase hover:bg-primary transition-all font-semibold">
                  Send Inquiry
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
