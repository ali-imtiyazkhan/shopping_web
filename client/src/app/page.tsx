"use client";

import { Button } from "../components/ui/button";
import { useSettingsStore } from "../store/useSettingsStore";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import ProductCard from "../components/user/ProductCard";

const collections = [
  {
    title: "THE ETHER COLLECTION",
    subtitle: "Minimalist silhouettes in charcoal and slate.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop",
  },
  {
    title: "ESSENTIAL LINENS",
    subtitle: "Breathable ivory fabrics for the modern nomad.",
    image: "https://images.unsplash.com/photo-1516257984877-a03a80479974?q=80&w=1974&auto=format&fit=crop",
  },
];

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { banners, featuredProducts, fetchFeaturedProducts, fetchBanners } =
    useSettingsStore();

  useEffect(() => {
    fetchBanners();
    fetchFeaturedProducts();
  }, [fetchBanners, fetchFeaturedProducts]);

  useEffect(() => {
    if (banners.length > 0) {
      const bannerTimer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(bannerTimer);
    }
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden group">
        {(banners.length > 0 ? banners : [{ id: 'demo', imageUrl: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop', title: 'VOREN', description: 'OBSIDIAN SERIES' }]).map((bannerItem: any, index: number) => (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
            key={bannerItem.id || index}
          >
            <div className="absolute inset-0">
              <img
                src={bannerItem.imageUrl}
                alt={bannerItem.title || "VOREN Hero"}
                className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-[10s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>
            <div className="relative h-full container mx-auto px-6 flex items-center">
              <div className="max-w-3xl space-y-8">
                <div className="overflow-hidden">
                  <span className="inline-block text-primary tracking-[0.4em] text-sm font-light animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    EST. 2026. THE ART OF LESS.
                  </span>
                </div>
                <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                  {bannerItem.title || "VOREN"}
                  <br />
                  <span className="italic font-normal opacity-90">Obsidian Edition</span>
                </h1>
                <p className="text-lg md:text-xl text-foreground/70 max-w-xl font-light leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                  Architected for the vanguard. A symphony of minimalist design, premium craftsmanship, and unparalleled luxury.
                </p>
                <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-700">
                  <Button className="h-14 px-10 bg-primary text-black hover:bg-primary/90 rounded-none border-none text-sm tracking-widest font-medium">
                    EXPLORE COLLECTION
                  </Button>
                  <Button variant="outline" className="h-14 px-10 rounded-none border-foreground/20 text-foreground hover:bg-foreground/5 text-sm tracking-widest">
                    OUR STORY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Banner Navigation Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-12 right-12 flex space-x-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-[1px] transition-all duration-500 ${
                  currentSlide === index
                    ? "bg-primary w-12"
                    : "bg-foreground/30 w-6 hover:bg-foreground/50"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust Signals / Benefits */}
      <section className="py-20 border-b border-border bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { icon: Truck, title: "EXPRESS DELIVERY", desc: "Global shipping with white-glove service." },
              { icon: ShieldCheck, title: "LUXURY ASSURED", desc: "Each piece comes with a certificate of authenticity." },
              { icon: RotateCcw, title: "EFFORTLESS RETURNS", desc: "Complimentary pickup for curated exchanges." },
            ].map((benefit, i) => (
              <div key={i} className="space-y-4">
                <benefit.icon className="w-8 h-8 mx-auto text-primary stroke-[1px]" />
                <h3 className="text-sm tracking-[0.3em] font-medium">{benefit.title}</h3>
                <p className="text-xs text-foreground/50 leading-relaxed uppercase tracking-wider">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4">
            <div className="space-y-4">
              <span className="text-primary text-xs tracking-[0.3em] uppercase">Curated Selects</span>
              <h2 className="text-4xl md:text-5xl font-serif">Seasonal Editions</h2>
            </div>
            <Button variant="link" className="text-primary p-0 space-x-2 h-auto tracking-widest text-xs uppercase">
              <span>View All Collections</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {collections.map((collection, index) => (
              <div key={index} className="group cursor-pointer relative overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 grayscale-[0.3] group-hover:grayscale-0"
                  />
                </div>
                <div className="mt-8 space-y-2">
                  <h3 className="text-xl font-serif">{collection.title}</h3>
                  <p className="text-sm text-foreground/50 tracking-wide font-light">{collection.subtitle}</p>
                  <div className="pt-4 overflow-hidden">
                    <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-primary transition-transform duration-500 translate-y-full group-hover:translate-y-0 underline underline-offset-8">
                      Explore Edits
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-card/20 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-foreground">VOREN ARRIVALS</h2>
            <p className="text-foreground/50 transition-all font-light tracking-widest text-xs uppercase underline underline-offset-[12px] decoration-primary/30">Limited Release • Handcrafted in Milan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
            {(featuredProducts.length > 0 ? featuredProducts : [
              { id: '1', name: 'OBSIDIAN OVERCOAT', price: '845.00', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop'], brand: 'VOREN ESSENTIAL' },
              { id: '2', name: 'IVORY MERINO KNIT', price: '320.00', images: ['https://images.unsplash.com/photo-1614251056216-f748f76cd228?q=80&w=1974&auto=format&fit=crop'], brand: 'VOREN STUDIO' },
              { id: '3', name: 'SLATE TAILORED TROUSER', price: '450.00', images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop'], brand: 'VOREN STUDIO' },
              { id: '4', name: 'GOLDEN SILK POCKET SQUARE', price: '95.00', images: ['https://images.unsplash.com/photo-1533055640609-24b498dfd74c?q=80&w=1974&auto=format&fit=crop'], brand: 'VOREN ACCESSORIES' }
            ]).map((product: any, index: number) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-40">
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-12">
          <div className="space-y-4">
            <span className="text-primary text-[10px] tracking-[0.5em] uppercase">Join the Collective</span>
            <h2 className="text-5xl md:text-6xl font-serif italic">Stay Informed</h2>
            <p className="text-foreground/50 font-light text-sm max-w-md mx-auto leading-relaxed">
              Sign up for early access to limited releases and the VOREN seasonal catalogs.
            </p>
          </div>
          <div className="relative max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="w-full bg-transparent border-b border-foreground/20 py-4 text-center focus:outline-none focus:border-primary transition-colors text-xs tracking-[0.2em]"
            />
            <button className="mt-8 text-xs tracking-[0.5em] uppercase text-primary hover:text-foreground transition-colors">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
