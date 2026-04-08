"use client";

import { Button } from "../../components/ui/button";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

      {/* Curated Collections Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4 max-w-xl">
              <span className="text-primary text-[10px] tracking-[0.5em] uppercase font-semibold">Discovery</span>
              <h2 className="text-4xl md:text-5xl font-serif">CURATED COLLECTIONS</h2>
              <p className="text-foreground/40 text-xs tracking-[0.2em] leading-relaxed">Explore our meticulously chosen archives, designed for those who appreciate the finer details of modern tailoring.</p>
            </div>
            <Link href="/listing" className="text-[10px] tracking-[0.3em] uppercase border-b border-black pb-1 hover:opacity-50 transition-opacity">
              View All Archives
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px]">
            {/* Mens - Large tile */}
            <div className="md:col-span-8 group relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1964&auto=format&fit=crop" 
                alt="Men" 
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700" />
              <div className="absolute inset-0 p-12 flex flex-col justify-end items-start text-white">
                <span className="text-[10px] tracking-[0.5em] mb-4 opacity-70">ESSENTIALS</span>
                <h3 className="text-4xl font-serif mb-6 uppercase tracking-wider">The Modern Man</h3>
                <Link href="/listing?category=Men" className="px-8 py-4 bg-white text-black text-[10px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all duration-300">
                  Shop Men
                </Link>
              </div>
            </div>

            {/* Women & Kids vertical stack */}
            <div className="md:col-span-4 flex flex-col gap-6">
               <div className="flex-1 group relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2070&auto=format&fit=crop" 
                    alt="Women" 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                    <h3 className="text-2xl font-serif mb-4 uppercase tracking-wider">Elegance</h3>
                    <Link href="/listing?category=Women" className="text-[10px] tracking-[0.3em] uppercase border-b border-white pb-1">
                      Shop Women
                    </Link>
                  </div>
               </div>
               <div className="flex-1 group relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1519234110483-8a76033005c4?q=80&w=1974&auto=format&fit=crop" 
                    alt="Kids" 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700" />
                   <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                    <h3 className="text-2xl font-serif mb-4 uppercase tracking-wider">Heritage</h3>
                    <Link href="/listing?category=Kids" className="text-[10px] tracking-[0.3em] uppercase border-b border-white pb-1">
                      Shop Kids
                    </Link>
                  </div>
               </div>
            </div>

            {/* Accessories & Footwear horizontal stack */}
            <div className="md:col-span-12 grid grid-cols-2 gap-6 h-64">
               <div className="group relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop" 
                    alt="Accessories" 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Link href="/listing?category=Accessories" className="text-white text-[12px] tracking-[0.6em] uppercase font-bold text-center px-4 py-2 border border-white/40 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all">
                      Accessories
                    </Link>
                  </div>
               </div>
               <div className="group relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop" 
                    alt="Footwear" 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-700" />
                   <div className="absolute inset-0 flex items-center justify-center">
                    <Link href="/listing?category=Footwear" className="text-white text-[12px] tracking-[0.6em] uppercase font-bold text-center px-4 py-2 border border-white/40 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all">
                      Footwear
                    </Link>
                  </div>
               </div>
            </div>
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
