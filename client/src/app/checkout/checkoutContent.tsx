"use client";

import { paymentAction } from "../../actions/payment";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { toast } from "../../hooks/use-toast";
import { useAddressStore } from "../../store/useAddressStore";
import { useAuthStore } from "../../store/useAuthStore";
import { CartItem, useCartStore } from "../../store/useCartStore";
import { Coupon, useCouponStore } from "../../store/useCouponStore";
import { useOrderStore } from "../../store/useOrderStore";
import { useProductStore } from "../../store/useProductStore";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";

function CheckoutContent() {
  const { addresses, fetchAddresses } = useAddressStore();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
    (CartItem & { product: any })[]
  >([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponAppliedError, setCouponAppliedError] = useState("");
  const { items, fetchCart, clearCart } = useCartStore();
  const { getProductById } = useProductStore();
  const { fetchCoupons, couponList } = useCouponStore();
  const {
    createPayPalOrder,
    capturePayPalOrder,
    createFinalOrder,
    isPaymentProcessing,
  } = useOrderStore();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchCoupons();
    fetchAddresses();
    fetchCart();
  }, [fetchAddresses, fetchCart, fetchCoupons]);

  useEffect(() => {
    const findDefaultAddress = addresses.find((address) => address.isDefault);

    if (findDefaultAddress) {
      setSelectedAddress(findDefaultAddress.id);
    }
  }, [addresses]);

  useEffect(() => {
    const fetchIndividualProductDetails = async () => {
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          return { ...item, product };
        })
      );

      setCartItemsWithDetails(itemsWithDetails);
    };

    fetchIndividualProductDetails();
  }, [items, getProductById]);

  function handleApplyCoupon() {
    const getCurrentCoupon = couponList.find((c) => c.code === couponCode.toUpperCase());

    if (!getCurrentCoupon) {
      setCouponAppliedError("Invalid protocol code");
      setAppliedCoupon(null);
      return;
    }

    const now = new Date();

    if (
      now < new Date(getCurrentCoupon.startDate) ||
      now > new Date(getCurrentCoupon.endDate)
    ) {
      setCouponAppliedError("Code validity period has expired");
      setAppliedCoupon(null);
      return;
    }

    if (getCurrentCoupon.usageCount >= getCurrentCoupon.usageLimit) {
      setCouponAppliedError("Code usage limit reached");
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(getCurrentCoupon);
    setCouponAppliedError("");
  }

  const handlePrePaymentFlow = async () => {
    if (!checkoutEmail) {
      toast({ title: "Email required for procurement", variant: "destructive" });
      return;
    }
    const result = await paymentAction(checkoutEmail);
    if (!result.success) {
      toast({
        title: result.error,
        variant: "destructive",
      });

      return;
    }

    setShowPaymentFlow(true);
  };

  const handleFinalOrderCreation = async (data: any) => {
    if (!user) {
      toast({
        title: "User session expired",
      });

      return;
    }
    try {
      const orderData = {
        userId: user?.id,
        addressId: selectedAddress,
        items: cartItemsWithDetails.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productCategory: item.product.category,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product.price,
        })),
        couponId: appliedCoupon?.id,
        total,
        paymentMethod: "CREDIT_CARD" as const,
        paymentStatus: "COMPLETED" as const,
        paymentId: data.id,
      };

      const createFinalOrderResponse = await createFinalOrder(orderData);

      if (createFinalOrderResponse) {
        await clearCart();
        router.push("/account");
      } else {
        toast({
          title: "Order synchronization failure",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Order synchronization failure",
        variant: "destructive",
      });
    }
  };

  const subTotal = cartItemsWithDetails.reduce(
    (acc: number, item: any) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  const discountAmount = appliedCoupon
    ? (subTotal * appliedCoupon.discountPercent) / 100
    : 0;

  const total = subTotal - discountAmount;

  if (isPaymentProcessing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin" />
        <h1 className="text-[10px] tracking-[0.5em] uppercase font-light animate-pulse">
          Processing Secure Transaction...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center space-y-4 mb-20">
          <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-light">Procurement Flow</span>
          <h1 className="text-5xl md:text-6xl font-serif">CHECKOUT</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-12">
            {/* Delivery Section */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4 border-b border-border pb-6">
                <span className="text-primary text-[10px] tracking-[0.3em] font-mono">01</span>
                <h2 className="text-2xl font-serif italic">Delivery Selection</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address: any) => (
                  <div 
                    key={address.id} 
                    onClick={() => setSelectedAddress(address.id)}
                    className={`p-8 border cursor-pointer transition-all duration-500 relative overflow-hidden group ${
                      selectedAddress === address.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-foreground">{address.name}</span>
                        {address.isDefault && (
                          <span className="text-[8px] tracking-[0.2em] uppercase text-primary border border-primary/30 px-2 py-0.5">Default</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-foreground/50 tracking-wide leading-relaxed">{address.address}</p>
                        <p className="text-xs text-foreground/50 tracking-wide uppercase">{address.city}, {address. country}</p>
                        <p className="text-[10px] tracking-widest text-foreground/40 font-mono pt-2">{address.phone}</p>
                      </div>
                    </div>
                    {selectedAddress === address.id && (
                      <div className="absolute top-0 right-0 w-8 h-8 bg-primary flex items-center justify-center">
                         <div className="w-2 h-2 bg-black rotate-45" />
                      </div>
                    )}
                  </div>
                ))}
                
                <button 
                  onClick={() => router.push("/account")}
                  className="p-8 border border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center space-y-4 text-foreground/30 hover:text-primary group"
                >
                  <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                  <span className="text-[10px] tracking-[0.3em] uppercase">New Address</span>
                </button>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-8">
               <div className="flex items-center space-x-4 border-b border-border pb-6">
                <span className="text-primary text-[10px] tracking-[0.3em] font-mono">02</span>
                <h2 className="text-2xl font-serif italic">Secure Payment</h2>
              </div>
              
              <div className="bg-card/20 border border-border p-10 space-y-10">
                {showPaymentFlow ? (
                  <div className="space-y-8 max-w-md mx-auto">
                    <div className="text-center space-y-2">
                       <h3 className="text-xs tracking-[0.3em] uppercase font-medium">Authorizing via PayPal</h3>
                       <p className="text-[10px] tracking-widest text-foreground/40 uppercase">Encrypted & Certified Connection</p>
                    </div>
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "black",
                        shape: "rect",
                        label: "pay",
                      }}
                      fundingSource="card"
                      createOrder={async () => {
                        const orderId = await createPayPalOrder(
                          cartItemsWithDetails,
                          total
                        );

                        if (orderId === null) {
                          throw new Error("Failed to create protocol order");
                        }

                        return orderId;
                      }}
                      onApprove={async (data, actions) => {
                        const captureData = await capturePayPalOrder(
                          data.orderID
                        );

                        if (captureData) {
                          await handleFinalOrderCreation(captureData);
                        } else {
                          toast({ title: "Capture failure", variant: "destructive" });
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-8 max-w-md mx-auto text-center">
                    <p className="text-xs text-foreground/50 tracking-[0.2em] uppercase leading-loose">
                      Identify yourself to proceed with this procurement.
                    </p>
                    <div className="space-y-6">
                      <input
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        className="w-full bg-transparent border-b border-border py-4 text-center focus:outline-none focus:border-primary transition-colors text-xs tracking-widest uppercase"
                        value={checkoutEmail}
                        onChange={(event) =>
                          setCheckoutEmail(event.target.value)
                        }
                      />
                      <Button 
                        onClick={handlePrePaymentFlow}
                        disabled={!selectedAddress}
                        className="w-full h-14 bg-foreground text-background hover:bg-primary transition-all rounded-none text-[10px] tracking-[0.4em] uppercase font-bold disabled:opacity-20 translate-y-2"
                      >
                        Proceed to Payment
                      </Button>
                      {!selectedAddress && (
                        <p className="text-[8px] tracking-[0.3em] uppercase text-primary animate-pulse">Please select a delivery address first</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-card/30 border border-border p-8 sticky top-32 space-y-8">
              <h2 className="text-xl font-serif italic border-b border-border pb-6">Your Selection</h2>
              
              <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartItemsWithDetails.map((item: any) => (
                    <div key={item.id} className="flex gap-6 items-center group">
                    <div className="aspect-[3/4] w-16 bg-card overflow-hidden flex-shrink-0 border border-border/20">
                      <img
                        src={item?.product?.images[0]}
                        alt={item?.product?.name}
                        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-[10px] tracking-[0.2em] uppercase font-medium">{item?.product?.name}</h3>
                      <p className="text-[9px] tracking-widest text-foreground/40 uppercase">
                        {item.color} / {item.size} × {item.quantity}
                      </p>
                      <p className="text-[10px] font-mono text-primary pt-1">
                        ${(item?.product?.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-8 border-t border-border">
                {/* Coupon Input */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      placeholder="ENTER PROTOCOL CODE"
                      className="flex-1 bg-transparent border-b border-border py-2 text-[10px] tracking-widest uppercase focus:outline-none focus:border-primary transition-colors"
                      onChange={(e) => setCouponCode(e.target.value)}
                      value={couponCode}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="text-[10px] tracking-[0.3em] uppercase text-primary hover:text-foreground transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponAppliedError && (
                    <p className="text-[9px] tracking-widest text-destructive uppercase animate-pulse">{couponAppliedError}</p>
                  )}
                  {appliedCoupon && (
                    <p className="text-[9px] tracking-widest text-primary uppercase">Protocol accepted: {appliedCoupon.discountPercent}% Reduction</p>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-[10px] tracking-[0.3em] uppercase">
                    <span className="text-foreground/40 font-light">Subtotal</span>
                    <span className="font-medium">${subTotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-[10px] tracking-[0.3em] uppercase text-primary">
                      <span className="font-light italic">Reduction Benefit</span>
                      <span className="font-medium italic">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[10px] tracking-[0.3em] uppercase">
                    <span className="text-foreground/40 font-light">Logistic Duties</span>
                    <span className="text-primary font-medium italic">Complimentary</span>
                  </div>

                  <div className="flex justify-between text-[10px] tracking-[0.3em] uppercase border-t border-border pt-6">
                    <span className="text-foreground font-semibold">Final Procurement</span>
                    <span className="text-foreground font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutContent;
