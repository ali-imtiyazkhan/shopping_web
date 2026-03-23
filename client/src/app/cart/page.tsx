"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function UserCartPage() {
  const {
    fetchCart,
    items,
    isLoading,
    updateCartItemQuantity,
    removeFromCart,
  } = useCartStore();
  const { user } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    await updateCartItemQuantity(id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemoveItem = async (id: string) => {
    setIsUpdating(true);
    await removeFromCart(id);
    setIsUpdating(false);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-[10px] tracking-[0.5em] animate-pulse uppercase">Refreshing your bag...</div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center space-y-4 mb-20">
          <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-light">Your Selection</span>
          <h1 className="text-5xl md:text-6xl font-serif">SHOPPING BAG</h1>
        </div>

        {items.length === 0 ? (
          <div className="py-40 text-center space-y-8 border-y border-border">
            <p className="text-foreground/40 text-xs tracking-widest uppercase">Your bag is currently empty</p>
            <Button 
              onClick={() => router.push("/listing")}
              className="px-12 h-14 bg-primary text-black rounded-none text-[10px] tracking-[0.3em] font-semibold uppercase"
            >
              Continue Exploring
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-12">
              <div className="border-b border-border pb-4 hidden md:grid grid-cols-12 text-[10px] tracking-[0.3em] uppercase text-foreground/40 font-medium">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-border/50 pb-12 transition-opacity duration-300" style={{ opacity: isUpdating ? 0.5 : 1 }}>
                  {/* Product Info */}
                  <div className="md:col-span-6 flex items-center gap-8">
                    <div className="aspect-[3/4] w-24 bg-card overflow-hidden flex-shrink-0 border border-border/20">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale-[0.2]"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xs tracking-[0.2em] uppercase font-medium">{item.name}</h3>
                      <div className="flex flex-col space-y-1">
                        <p className="text-[10px] tracking-widest text-foreground/40 uppercase">Color: {item.color}</p>
                        <p className="text-[10px] tracking-widest text-foreground/40 uppercase">Size: {item.size}</p>
                      </div>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-[9px] tracking-[0.4em] uppercase text-primary hover:text-foreground transition-colors pt-4 block"
                      >
                        Remove Piece
                      </button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex justify-center">
                    <div className="flex items-center border border-border/30 h-10">
                      <button
                        disabled={isUpdating || item.quantity <= 1}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-full flex items-center justify-center hover:bg-foreground/5 transition-colors disabled:opacity-20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-[11px] font-mono tracking-tighter">{item.quantity}</span>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-full flex items-center justify-center hover:bg-foreground/5 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-right">
                    <p className="text-[11px] font-mono tracking-tight text-foreground/60">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Total */}
                  <div className="md:col-span-2 text-right">
                    <p className="text-[11px] font-mono tracking-tight text-primary font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-card/30 border border-border p-10 sticky top-32 space-y-10">
                <h2 className="text-2xl font-serif italic border-b border-border pb-6">Summary</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between text-[10px] tracking-[0.3em] uppercase">
                    <span className="text-foreground/40 font-light">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] tracking-[0.3em] uppercase">
                    <span className="text-foreground/40 font-light">Logistic Duties</span>
                    <span className="text-primary font-medium italic">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-[10px] tracking-[0.3em] uppercase border-t border-border pt-6">
                    <span className="text-foreground font-semibold">Total</span>
                    <span className="text-foreground font-bold text-lg">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => router.push("/checkout")}
                    className="w-full h-14 bg-foreground text-background hover:bg-primary transition-all rounded-none text-[10px] tracking-[0.4em] uppercase font-bold"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    onClick={() => router.push("/listing")}
                    variant="ghost"
                    className="w-full h-14 rounded-none text-[9px] tracking-[0.4em] uppercase text-foreground/40 hover:text-foreground transition-all"
                  >
                    Continue Selection
                  </Button>
                </div>

                <div className="pt-8 border-t border-border space-y-4">
                  <p className="text-[9px] tracking-widest text-foreground/30 text-center uppercase leading-loose">
                    Security assured via encrypted transactions.<br />
                    VOREN Concierges are ready to assist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCartPage;
