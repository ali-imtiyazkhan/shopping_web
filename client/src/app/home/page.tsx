"use client";

import { Button } from "../../components/ui/button";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const gridItems = [
  {
    title: "WOMEN",
    subtitle: "From world's top designer",
    image:
      "https://images.unsplash.com/photo-1614251056216-f748f76cd228?q=80&w=1974&auto=format&fit=crop",
  },
  {
    title: "FALL LEGENDS",
    subtitle: "Timeless cool weather",
    image:
      "https://avon-demo.myshopify.com/cdn/shop/files/demo1-winter1_600x.png?v=1733380268",
  },
  {
    title: "ACCESSORIES",
    subtitle: "Everything you need",
    image:
      "https://avon-demo.myshopify.com/cdn/shop/files/demo1-winter4_600x.png?v=1733380275",
  },
  {
    title: "HOLIDAY SPARKLE EDIT",
    subtitle: "Party season ready",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1974&auto=format&fit=crop",
  },
];

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const { banners, featuredProducts, fetchFeaturedProducts, fetchBanners } =
    useSettingsStore();

  useEffect(() => {
    fetchBanners();
    fetchFeaturedProducts();
  }, [fetchBanners, fetchFeaturedProducts]);

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(bannerTimer);
  }, [banners.length]);

  console.log(banners, featuredProducts);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[600px] overflow-hidden">
        {banners.map((bannerItem, index) => (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
            key={bannerItem.id}
          >
            <div className="absolute inset-0">
              <img
                src={bannerItem.imageUrl}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20" />
            </div>
            <div className="relative h-full container mx-auto px-4 flex items-center">
              <div className="text-white space-y-6">
                <span className="text-sm uppercase tracking-[0.4em] font-medium text-primary">
                  VOREN ARCHIVE
                </span>
                <h1 className="text-5xl lg:text-7xl font-serif leading-tight uppercase tracking-tighter">
                  The New Standard
                  <br />
                  of Minimalism
                </h1>
                <p className="text-lg font-light tracking-widest opacity-80 italic font-serif text-white/90">
                  Curated essentials for the modern man. 
                  <br />
                  Refinement in every stitch.
                </p>
                <Button className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg">
                  SHOP NOW
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </section>

      {/* grid section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-semibold mb-2">
            THE WINTER EDIT
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Designed to keep your satisfaction and warmth
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gridItems.map((gridItem, index) => (
              <div key={index} className="relative group overflow-hidden">
                <div className="aspect-[3/4]">
                  <img
                    src={gridItem.image}
                    alt={gridItem.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {gridItem.title}
                    </h3>
                    <p className="text-sm">{gridItem.subtitle}</p>
                    <Button className="mt-4 bg-white text-black hover:bg-gray-100">
                      SHOP NOW
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature products section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-semibold mb-2">
            NEW ARRIVALS
          </h2>
          <p className="text-center text-gray-500 mb-12 uppercase text-[10px] tracking-[0.3em]">
            Shop our new arrivals from the latest VOREN archive
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 4).map((productItem, index) => (
              <div key={index} className="relative group overflow-hidden">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={productItem.images[0]}
                    alt={productItem.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black text-white text-[8px] tracking-[0.2em] uppercase px-2 py-1 font-medium">New</span>
                  </div>
                </div>
                <div className="mt-6 space-y-1">
                  <h3 className="text-sm font-medium tracking-widest uppercase">
                    {productItem.name}
                  </h3>
                  <p className="text-xs text-gray-500 tracking-wider">
                    ${Number(productItem.price).toFixed(2)}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors" onClick={() => router.push(`/listing/${productItem.id}`)}>
                    Discover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-[#F9F9F9]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">BEST SELLERS</h2>
              <p className="text-gray-500 text-sm tracking-widest uppercase max-w-md">Our most coveted pieces, curated for the modern aesthetic.</p>
            </div>
            <Button variant="outline" className="text-[10px] tracking-[0.3em] uppercase px-8 py-6 rounded-none border-black hover:bg-black hover:text-white transition-all" onClick={() => router.push('/listing')}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(1, 5).reverse().map((productItem, index) => (
              <div key={index} className="group cursor-pointer" onClick={() => router.push(`/listing/${productItem.id}`)}>
                <div className="aspect-[3/4] overflow-hidden bg-gray-200 relative">
                  <img
                    src={productItem.images[0]}
                    alt={productItem.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-6 space-y-2">
                  <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-medium">Essential</p>
                  <h3 className="text-sm font-medium tracking-widest uppercase">
                    {productItem.name}
                  </h3>
                  <p className="text-xs tracking-wider">
                    ${Number(productItem.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / USP Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <h3 className="text-xs tracking-[0.5em] uppercase font-medium">Global Delivery</h3>
              <p className="text-sm opacity-60 font-light tracking-wide">Complimentary express shipping on all orders over $500.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs tracking-[0.5em] uppercase font-medium">Uncompromising Quality</h3>
              <p className="text-sm opacity-60 font-light tracking-wide">Each piece is crafted using the world's finest sustainable materials.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs tracking-[0.5em] uppercase font-medium">Personal Assistance</h3>
              <p className="text-sm opacity-60 font-light tracking-wide">Dedicated concierge styling and customer support 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-8 block font-medium">Voices of Voren</span>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif italic text-gray-800 leading-relaxed">
              "The quality and attention to detail at VOREN are unlike anything I've experienced. Truly the new standard of modern minimalism."
            </h2>
            <div className="space-y-1">
              <p className="text-xs tracking-[0.3em] uppercase font-semibold">David Harrison</p>
              <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">Art Director, London</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter signup section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl tracking-[0.3em] uppercase">Join the Archive</h2>
              <p className="text-sm text-gray-500 font-light tracking-widest uppercase">Be the first to know about new drops and exclusive experiences.</p>
            </div>
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="flex-1 bg-transparent border-b border-gray-300 py-3 text-xs tracking-widest focus:outline-none focus:border-black transition-colors"
                required
              />
              <button 
                type="submit" 
                className="bg-black text-white text-[10px] tracking-[0.4em] uppercase px-12 py-4 hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
