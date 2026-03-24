"use client";

import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useProductStore } from "../../../store/useProductStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetailsSkeleton from "./productSkeleton";
import { useCartStore } from "../../../store/useCartStore";
import { useToast } from "../../../hooks/use-toast";

function ProductDetailsContent({ id }: { id: string }) {
  const [product, setProduct] = useState<any>(null);
  const { getProductById, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const atcButton = document.getElementById("main-atc-button");
      if (atcButton) {
        const rect = atcButton.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const productDetails = await getProductById(id);
      if (productDetails) {
        setProduct(productDetails);
      } else {
        router.push("/404");
      }
    };

    fetchProduct();
  }, [id, getProductById, router]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        color: product.colors[selectedColor],
        size: selectedSize,
        quantity: quantity,
      });

      setSelectedSize("");
      setSelectedColor(0);
      setQuantity(1);

      toast({
        title: "Product is added to cart",
      });
    }
  };

  console.log(id, product);

  if (!product || isLoading) return <ProductDetailsSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 flex gap-4">
            <div className="hidden lg:flex flex-col gap-2 w-24">
              {product?.images.map((image: string, index: number) => (
                <button
                  onClick={() => setSelectedImage(index)}
                  key={index}
                  className={`${
                    selectedImage === index
                      ? "border-black"
                      : "border-transparent"
                  } border-2`}
                >
                  <img
                    src={image}
                    alt={`Product-${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 relative w-[300px]">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:w-1/3 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div>
                <span className="text-2xl font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color: string, index: number) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-full border-2 ${
                      selectedColor === index
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(index)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size: string, index: string) => (
                  <Button
                    key={index}
                    className={`w-12 h-12`}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  variant="outline"
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  variant="outline"
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <Button
                id="main-atc-button"
                className={"w-full bg-black text-white hover:bg-gray-800"}
                onClick={handleAddToCart}
              >
                ADD TO CART
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4 opacity-50 grayscale">
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                <span className="text-[9px] tracking-[0.2em] uppercase font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                <span className="text-[9px] tracking-[0.2em] uppercase font-medium">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                <span className="text-[9px] tracking-[0.2em] uppercase font-medium">Authentic</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start border-b">
              <TabsTrigger value="details">PRODUCT DESCRIPTION</TabsTrigger>
              <TabsTrigger value="reviews">REVIEWS</TabsTrigger>
              <TabsTrigger value="shipping">
                SHIPPING & RETURNS INFO
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-5">
              <p className="text-gray-700 mb-4">{product.description}</p>
            </TabsContent>
            <TabsContent value="reviews" className="mt-5">
              Reviews
            </TabsContent>
            <TabsContent value="shipping">
              <p className="text-gray-700 mb-4">
                Shipping and return information goes here.Please read the info
                before proceeding.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sticky Add to Cart Bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 transition-transform duration-300 transform ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover" />
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase">{product.name}</p>
              <p className="text-xs text-gray-400">${product.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex-1 flex gap-4 max-w-md">
            <div className="flex items-center border border-gray-200">
               <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-xs">-</button>
               <span className="w-8 text-center text-xs">{quantity}</span>
               <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-xs">+</button>
            </div>
            <Button onClick={handleAddToCart} className="flex-1 bg-black text-white text-[10px] tracking-[0.2em] uppercase py-6">
              ADD TO CART
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsContent;
