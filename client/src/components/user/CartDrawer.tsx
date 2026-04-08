"use client";

import { useCartStore } from "../../store/useCartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, fetchCart, updateCartItemQuantity, removeFromCart, isLoading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-sm font-semibold tracking-[0.3em] uppercase">Your Bag ({items.length})</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-[10px] tracking-[0.2em] uppercase">Your bag is empty</p>
              <SheetTrigger asChild>
                <Button variant="outline" className="text-[10px] tracking-[0.2em] uppercase rounded-none border-black">Continue Shopping</Button>
              </SheetTrigger>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-24 aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-[10px] font-semibold tracking-wider uppercase leading-tight">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="opacity-40 hover:opacity-100 transition-opacity">
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-[9px] text-gray-400 tracking-widest uppercase">{item.size} / {item.color}</p>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-gray-100 h-8">
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-8 text-center text-[10px] tabular-nums">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="px-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <p className="text-[10px] font-medium tracking-wider">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-gray-50/50 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase font-medium">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[9px] text-gray-400 tracking-wider">Taxes and shipping calculated at checkout.</p>
            </div>
            <div className="space-y-3">
              <Button className="w-full h-14 bg-black text-white text-[10px] tracking-[0.4em] uppercase rounded-none hover:bg-gray-800 transition-colors">
                Proceed to Checkout
              </Button>
              <SheetTrigger asChild>
                <button className="w-full text-center text-[9px] tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors">
                  Continue Shopping
                </button>
              </SheetTrigger>
            </div>
            
            {/* Trust note */}
            <div className="pt-2 flex items-center justify-center gap-4 opacity-30 grayscale scale-75">
               <div className="flex items-center gap-1">
                 <div className="w-1 h-1 rounded-full bg-black"></div>
                 <span className="text-[8px] tracking-widest uppercase">Secure</span>
               </div>
               <div className="flex items-center gap-1">
                 <div className="w-1 h-1 rounded-full bg-black"></div>
                 <span className="text-[8px] tracking-widest uppercase">Fast Delivery</span>
               </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
