"use client";

import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { protectSignUpAction } from "../../../actions/auth";
import { useToast } from "../../../hooks/use-toast";
import { useAuthStore } from "../../../store/useAuthStore";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

function Registerpage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const checkFirstLevelOfValidation = await protectSignUpAction(
      formData.email
    );
    if (!checkFirstLevelOfValidation.success) {
      toast({
        title: checkFirstLevelOfValidation.error,
        variant: "destructive",
      });
      return;
    }

    const userId = await register(
      formData.name,
      formData.email,
      formData.password
    );
    if (userId) {
      toast({
        title: "Welcome to the VOREN Collective.",
      });
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row-reverse">
      {/* Editorial Image Side */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/40 z-10 transition-colors group-hover:bg-black/20" />
        <img
          src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop"
          alt="VOREN Collection"
          className="w-full h-full object-cover grayscale-[0.5] transition-transform duration-[10s] group-hover:scale-110"
        />
        <div className="absolute bottom-20 right-20 z-20 space-y-4 text-right">
          <span className="text-primary text-[10px] tracking-[0.5em] uppercase">VOREN MEMBERSHIP</span>
          <h2 className="text-4xl font-serif text-white italic">A NEW STANDARD<br />OF LUXURY.</h2>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24">
        <div className="max-w-md w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl tracking-[0.4em] font-serif uppercase text-foreground">VOREN</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 font-light">Join the digital collective</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 ml-1">Full Identity</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="EX: STEFANO VOREN"
                  required
                  className="bg-transparent border-b border-border py-6 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm tracking-widest"
                  value={formData.name}
                  onChange={handleOnChange}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 ml-1">Email Protocol</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="bg-transparent border-b border-border py-6 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm tracking-widest"
                  placeholder="EX: ARCHIVE@VOREN.COM"
                  required
                  value={formData.email}
                  onChange={handleOnChange}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 ml-1">Secret Key</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="bg-transparent border-b border-border py-6 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm tracking-widest"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleOnChange}
                />
              </div>
            </div>

            <div className="space-y-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-foreground text-background hover:bg-primary transition-all rounded-none text-[10px] tracking-[0.4em] uppercase font-bold"
              >
                {isLoading ? "Synchronizing..." : "Create Profile"}
              </Button>

              <div className="text-center space-y-4 pt-4">
                <p className="text-[10px] tracking-widest text-foreground/40 uppercase">
                  Already a collector?
                </p>
                <Link
                  href={"/auth/login"}
                  className="inline-block text-[10px] tracking-[0.3em] uppercase text-primary hover:text-foreground transition-colors font-bold border-b border-primary/30 pb-1"
                >
                  Enter the Archive
                </Link>
              </div>
            </div>
          </form>
          
          <p className="text-[9px] tracking-widest text-foreground/30 text-center uppercase leading-loose">
            By creating a profile, you agree to the VOREN<br />
            Terms of Service and Privacy Protocol.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registerpage;
