"use client";

import { Button } from "../../components/ui/button";

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
            alt="VOREN Studio"
            className="w-full h-full object-cover grayscale-[0.5] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="relative text-center space-y-6 px-6">
          <span className="text-primary text-xs tracking-[0.5em] uppercase">The Philosophy</span>
          <h1 className="text-6xl md:text-8xl font-serif">OUR STORY</h1>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-serif italic">The Art of Less</h2>
              <p className="text-foreground/60 font-light leading-loose text-lg">
                VOREN was born in the quiet spaces of Milan. We believe that true luxury is found in the intersection of exceptional materials and minimalist design. Our mission is to curate a wardrobe that transcends trends—pieces that are as timeless as they are modern.
              </p>
              <p className="text-foreground/60 font-light leading-loose text-lg">
                Every silhouette is architected with purpose. Every fabric is sourced with ethics in mind. We don't just make clothing; we design uniforms for the vanguard.
              </p>
            </div>
            <div className="aspect-[4/5] bg-card overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=1974&auto=format&fit=crop"
                alt="Minimalist Tailoring"
                className="w-full h-full object-cover grayscale-[0.2]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-32 bg-card/20 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <span className="text-primary text-[10px] tracking-[0.4em] uppercase">01</span>
              <h3 className="text-xl font-serif">PURE QUALITY</h3>
              <p className="text-sm text-foreground/50 font-light leading-relaxed">
                We use only the finest long-staple cottons, recycled merinos, and obsidian-grade silks.
              </p>
            </div>
            <div className="space-y-6">
              <span className="text-primary text-[10px] tracking-[0.4em] uppercase">02</span>
              <h3 className="text-xl font-serif">ETHICAL REACH</h3>
              <p className="text-sm text-foreground/50 font-light leading-relaxed">
                Direct partnerships with small-scale artisans in Italy ensure fair wages and unparalleled skill.
              </p>
            </div>
            <div className="space-y-6">
              <span className="text-primary text-[10px] tracking-[0.4em] uppercase">03</span>
              <h3 className="text-xl font-serif">RADICAL TRANSPARENCY</h3>
              <p className="text-sm text-foreground/50 font-light leading-relaxed">
                From the source of the yarn to the final stitch, our supply chain is an open book.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 text-center space-y-12">
        <h2 className="text-5xl md:text-6xl font-serif">Experience the Collection</h2>
        <Button className="h-16 px-12 bg-primary text-black hover:bg-primary/90 rounded-none text-sm tracking-[0.3em] font-medium transition-all hover:px-14">
          EXPLORE VOREN
        </Button>
      </section>
    </div>
  );
}

export default AboutPage;
