"use client";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useToast } from "../../hooks/use-toast";
import { Address, useAddressStore } from "../../store/useAddressStore";
import { useOrderStore } from "../../store/useOrderStore";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const initialAddressFormState = {
  name: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  phone: "",
  isDefault: false,
};

function UserAccountPage() {
  const {
    isLoading: addressesLoading,
    addresses,
    error: addressesError,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  } = useAddressStore();
  const [showAddresses, setShowAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialAddressFormState);
  const { toast } = useToast();
  const router = useRouter();
  const { userOrders, getOrdersByUserId, isLoading } = useOrderStore();

  useEffect(() => {
    fetchAddresses();
    getOrdersByUserId();
  }, [fetchAddresses, getOrdersByUserId]);

  console.log(userOrders, "userOrders");

  const handleAddressSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (editingAddress) {
        const result = await updateAddress(editingAddress, formData);
        if (result) {
          fetchAddresses();
          setEditingAddress(null);
        }
      } else {
        const result = await createAddress(formData);
        if (result) {
          fetchAddresses();
          toast({
            title: "Address created successfully",
          });
        }
      }

      setShowAddresses(false);
      setFormData(initialAddressFormState);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      name: address.name,
      address: address.address,
      city: address.city,
      country: address.country,
      phone: address.phone,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });

    setEditingAddress(address.id);
    setShowAddresses(true);
  };

  const handleDeleteAddress = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you wanna delete this address?"
    );

    if (confirmed) {
      try {
        const success = await deleteAddress(id);
        if (success) {
          toast({
            title: "Address is deleted successfully",
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  console.log(addresses);

  const getStatusStyle = (
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED"
  ) => {
    switch (status) {
      case "PENDING":
        return "bg-primary/20 text-primary border-primary/20";
      case "PROCESSING":
        return "bg-primary/30 text-primary border-primary/30";
      case "SHIPPED":
        return "bg-foreground/10 text-foreground border-border";
      case "DELIVERED":
        return "bg-foreground/20 text-foreground border-border";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin" />
        <h1 className="text-[10px] tracking-[0.5em] uppercase font-light animate-pulse">
          Retrieving Digital Archive...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center space-y-4 mb-20">
          <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-light">Member Profile</span>
          <h1 className="text-5xl md:text-6xl font-serif">IDENTITY</h1>
        </div>

        <Tabs defaultValue="orders" className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="bg-transparent border-b border-border w-full justify-center flex gap-12 h-auto p-0">
              <TabsTrigger 
                value="orders" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground text-[10px] tracking-[0.4em] uppercase font-bold py-4 px-0 transition-all text-foreground/40 hover:text-foreground"
              >
                Procurement History
              </TabsTrigger>
              <TabsTrigger 
                value="addresses" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground text-[10px] tracking-[0.4em] uppercase font-bold py-4 px-0 transition-all text-foreground/40 hover:text-foreground"
              >
                Logistics Entries
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders" className="space-y-8 mt-0 focus-visible:ring-0">
            <div className="bg-card/20 border border-border p-10">
              <div className="flex items-center space-x-4 border-b border-border pb-6 mb-10">
                <span className="text-primary text-[10px] tracking-[0.3em] font-mono">Archive</span>
                <h2 className="text-2xl font-serif italic">Your Past Selections</h2>
              </div>
              
              {userOrders.length === 0 ? (
                <div className="py-20 text-center space-y-6">
                   <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 font-light">No records found in this archive.</p>
                   <Button 
                    onClick={() => router.push("/listing")}
                    variant="outline"
                    className="h-14 bg-transparent text-primary hover:bg-primary hover:text-background transition-all rounded-none text-[10px] tracking-[0.4em] uppercase font-bold px-12"
                   >
                     Begin Procurement
                   </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-[10px] tracking-[0.2em] uppercase font-semibold h-16">Reference</TableHead>
                        <TableHead className="text-[10px] tracking-[0.2em] uppercase font-semibold">Date</TableHead>
                        <TableHead className="text-[10px] tracking-[0.2em] uppercase font-semibold">Manifest</TableHead>
                        <TableHead className="text-[10px] tracking-[0.2em] uppercase font-semibold">Status</TableHead>
                        <TableHead className="text-[10px] tracking-[0.2em] uppercase font-semibold text-right">Investment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userOrders.map((order) => (
                        <TableRow key={order.id} className="border-border/30 hover:bg-foreground/[0.02] group transition-colors">
                          <TableCell className="font-mono text-[9px] tracking-widest uppercase text-foreground/50 py-8">
                            #{order.id.slice(-8).toUpperCase()}
                          </TableCell>
                          <TableCell className="text-[10px] tracking-widest text-foreground/70">
                            {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </TableCell>
                          <TableCell className="text-[10px] tracking-widest text-foreground/70 font-light">
                            {order.items.length}{" "}
                            {order.items.length > 1 ? "PIECES" : "PIECE"}
                          </TableCell>
                          <TableCell>
                            <Badge className={`rounded-none border text-[8px] tracking-[0.2em] font-bold px-3 py-1 ${getStatusStyle(order.status)}`}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[12px] font-bold text-right tracking-widest">
                            ${order.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-8 mt-0 focus-visible:ring-0">
            <div className="bg-card/20 border border-border p-10">
              <div className="flex justify-between items-center border-b border-border pb-6 mb-10">
                <div className="flex items-center space-x-4 ">
                  <span className="text-primary text-[10px] tracking-[0.3em] font-mono">Directives</span>
                  <h2 className="text-2xl font-serif italic">Registered Addresses</h2>
                </div>
                {!showAddresses && (
                  <Button
                    onClick={() => {
                      setEditingAddress(null);
                      setFormData(initialAddressFormState);
                      setShowAddresses(true);
                    }}
                    className="h-10 bg-foreground text-background hover:bg-primary transition-all rounded-none text-[9px] tracking-[0.3em] uppercase font-bold px-6"
                  >
                    Add Entry
                  </Button>
                )}
              </div>

              {addressesLoading ? (
                <div className="flex flex-col items-center py-20 animate-pulse space-y-4">
                   <div className="w-1 h-20 bg-primary/20" />
                   <p className="text-[10px] tracking-[0.4em] uppercase font-light text-foreground/30">Syncing Locations</p>
                </div>
              ) : showAddresses ? (
                <div className="max-w-2xl mx-auto py-10">
                  <form onSubmit={handleAddressSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-2">
                        <Label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 ml-1">Identity</Label>
                        <Input
                          value={formData.name}
                          required
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="EX: STEFANO VOREN"
                          className="bg-transparent border-b border-border py-4 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors text-xs tracking-widest"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 ml-1">Protocol Phone</Label>
                        <Input
                          value={formData.phone}
                          required
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (000) 000-0000"
                          className="bg-transparent border-b border-border py-4 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors text-xs tracking-widest"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                       <Label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 ml-1">Street Directive</Label>
                       <Input
                        value={formData.address}
                        required
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="EX: 123 ARCHIVE SQUARE"
                        className="bg-transparent border-b border-border py-4 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors text-xs tracking-widest"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      <div className="space-y-2">
                        <Label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 ml-1">City</Label>
                        <Input
                          value={formData.city}
                          required
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="FLORENCE"
                          className="bg-transparent border-b border-border py-4 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors text-xs tracking-widest font-serif italic"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 ml-1">Postal Code</Label>
                        <Input
                          value={formData.postalCode}
                          required
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          placeholder="50121"
                          className="bg-transparent border-b border-border py-4 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors text-xs tracking-widest font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 ml-1">Country</Label>
                        <Input
                          value={formData.country}
                          required
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          placeholder="ITALY"
                          className="bg-transparent border-b border-border py-4 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors text-xs tracking-widest"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-4">
                      <Checkbox
                        id="default"
                        checked={formData.isDefault}
                        onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
                        className="rounded-none border-border"
                      />
                      <Label className="text-[10px] tracking-[0.3em] uppercase text-foreground/60 font-light" htmlFor="default">
                        Nominate as Primary Delivery Protocol
                      </Label>
                    </div>

                    <div className="flex gap-6 pt-10 border-t border-border">
                        <Button 
                          type="submit"
                          className="flex-1 h-14 bg-foreground text-background hover:bg-primary transition-all rounded-none text-[10px] tracking-[0.4em] uppercase font-bold"
                         >
                          {editingAddress ? "Confirm Protocol Update" : "Establish New Directive"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setShowAddresses(false);
                            setEditingAddress(null);
                          }}
                          className="h-14 px-10 text-[10px] tracking-[0.4em] uppercase text-foreground/40 hover:text-primary transition-colors rounded-none border border-border"
                        >
                          Revoke
                        </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`p-10 border transition-all duration-500 relative overflow-hidden group ${
                        address.isDefault 
                          ? "border-primary bg-primary/[0.03]" 
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-foreground">{address.name}</span>
                            <div className="flex items-center gap-3 mt-1">
                               <p className="text-[10px] tracking-widest text-foreground/40 font-mono italic">Primary Identity</p>
                               {address.isDefault && (
                                <span className="text-[8px] tracking-[0.2em] uppercase text-primary border border-primary/30 px-2 py-0.5">Primary</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 border-l border-primary/20 pl-6">
                          <p className="text-xs text-foreground/60 tracking-wide leading-relaxed uppercase">{address.address}</p>
                          <p className="text-xs text-foreground/60 tracking-wide uppercase font-serif italic">
                            {address.city}, {address.country}
                          </p>
                          <p className="text-[10px] tracking-[0.4em] text-foreground/40 font-mono pt-4">{address.phone}</p>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-[9px] tracking-[0.4em] uppercase text-foreground/40 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1"
                          >
                            Modify
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-[9px] tracking-[0.4em] uppercase text-foreground/40 hover:text-destructive transition-colors border-b border-transparent hover:border-destructive pb-1"
                          >
                            Discard
                          </button>
                        </div>
                      </div>
                      
                      {address.isDefault && (
                         <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 overflow-hidden">
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-l-[48px] border-t-primary border-l-transparent opacity-20" />
                         </div>
                      )}
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => {
                        setEditingAddress(null);
                        setFormData(initialAddressFormState);
                        setShowAddresses(true);
                      }}
                    className="p-10 border border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center space-y-4 text-foreground/30 hover:text-primary group min-h-[300px]"
                  >
                    <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                    <span className="text-[10px] tracking-[0.3em] uppercase">Add Logistics Record</span>
                  </button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserAccountPage;
