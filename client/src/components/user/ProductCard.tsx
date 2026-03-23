import { useState } from "react";
import { ShoppingBag, X, Plus, Minus, Eye } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useToast } from "../../hooks/use-toast";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string | number;
    images: string[];
    brand?: string;
    description?: string;
    sizes?: string[];
    colors?: string[];
  };
}

function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, isLoading: isCartLoading } = useCartStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();

  const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1594932224456-748956891eb7?q=80&w=1974&auto=format&fit=crop";

  const handleAddToBag = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Session Required",
        description: "Please log in to add items to your archive.",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        image: imageUrl,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
      });

      toast({
        title: "Added to Archive",
        description: `${product.name} has been added to your bag.`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to bag. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="group flex flex-col items-center w-full cursor-pointer" onClick={() => setOpen(true)}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full bg-card overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.19, 1, 0.22, 1) group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 space-y-4">
            <Button 
              onClick={(e) => { e.stopPropagation(); setOpen(true); }}
              className="w-full max-w-[160px] bg-foreground text-background rounded-none py-6 text-[10px] tracking-[0.3em] uppercase hover:bg-primary transition-colors duration-300"
            >
              Quick View
            </Button>
            <button 
              onClick={handleAddToBag}
              disabled={isCartLoading}
              className="text-[10px] tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>{isCartLoading ? "Adding..." : "Add to Bag"}</span>
            </button>
          </div>

          <div className="absolute top-4 left-4">
            <span className="text-[9px] tracking-[0.4em] uppercase py-1 px-3 bg-primary text-black font-semibold">
              New
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-8 text-center space-y-2 w-full">
          {product.brand && (
            <span className="text-[9px] tracking-[0.4em] uppercase text-foreground/40 font-light">
              {product.brand}
            </span>
          )}
          <h4 className="text-sm tracking-[0.2em] uppercase font-medium group-hover:text-primary transition-colors truncate w-full px-2">
            {product.name}
          </h4>
          <div className="flex items-center justify-center space-x-3">
            <p className="text-primary text-[11px] font-serif italic">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </p>
          </div>
        </div>
      </div>

      {/* Quick View Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border rounded-none">
          <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
            {/* Image Gallery */}
            <div className="md:w-1/2 bg-card relative aspect-[3/4]">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover grayscale-[0.2]"
              />
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.5em] uppercase text-primary font-medium">
                  {product.brand || "VOREN"}
                </span>
                <DialogTitle className="text-3xl font-serif tracking-tight text-foreground uppercase">
                  {product.name}
                </DialogTitle>
                <p className="text-xl font-serif italic text-primary">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-xs leading-relaxed text-foreground/60 tracking-wider">
                  {product.description || "Crafted from superior materials, this piece embodies the minimalist luxury of the VOREN archive. A testament to timeless design and modern refinement."}
                </p>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">Select Size</h5>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`h-10 w-12 text-[10px] tracking-widest transition-all border ${
                            selectedSize === size
                              ? "bg-foreground text-background border-foreground"
                              : "border-border text-foreground/60 hover:border-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">Select Color</h5>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 text-[10px] tracking-widest transition-all border uppercase ${
                            selectedColor === color
                              ? "bg-foreground text-background border-foreground"
                              : "border-border text-foreground/60 hover:border-foreground"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="space-y-4 pt-4">
                  <h5 className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">Quantity</h5>
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-foreground/40 hover:text-foreground transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono tracking-widest">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-foreground/40 hover:text-foreground transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Bag Button */}
              <div className="pt-8">
                <Button 
                  onClick={() => handleAddToBag()}
                  disabled={isCartLoading}
                  className="w-full h-14 bg-foreground text-background rounded-none text-[11px] tracking-[0.4em] uppercase hover:bg-primary transition-all duration-500"
                >
                  {isCartLoading ? "Adding to Archive..." : "Add to Archive"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductCard;

