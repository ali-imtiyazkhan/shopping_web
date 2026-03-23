"use client";

import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "../../../hooks/use-toast";
import { useAuthStore } from "../../../store/useAuthStore";
import { useRouter } from "next/navigation";
import { protectSignInAction } from "../../../actions/auth";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const checkFirstLevelOfValidation = await protectSignInAction(
      formData.email
    );

    if (!checkFirstLevelOfValidation.success) {
      toast({
        title: checkFirstLevelOfValidation.error,
        variant: "destructive",
      });
      return;
    }

    const success = await login(formData.email, formData.password);
    if (success) {
      toast({
        title: "Welcome back to VOREN.",
      });
      const user = useAuthStore.getState().user;
      if (user?.role === "SUPER_ADMIN" || user?.role === "ADMIN") router.push("/super-admin");
      else router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Editorial Image Side */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/40 z-10 transition-colors group-hover:bg-black/20" />
        <img
          src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1964&auto=format&fit=crop"
          alt="VOREN Portrait"
          className="w-full h-full object-cover grayscale-[0.5] transition-transform duration-[10s] group-hover:scale-110"
        />
        <div className="absolute bottom-20 left-20 z-20 space-y-4">
          <span className="text-primary text-[10px] tracking-[0.5em] uppercase">VOREN IDENTITY</span>
          <h2 className="text-4xl font-serif text-white italic">REFINEMENT<br />DEFINED.</h2>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24">
        <div className="max-w-md w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl tracking-[0.4em] font-serif uppercase text-foreground">VOREN</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 font-light">Access your digital archive</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
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
                <div className="flex justify-between items-center group">
                  <Label className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 ml-1">Secret Key</Label>
                  <Link href="#" className="text-[9px] tracking-widest text-foreground/30 hover:text-primary transition-colors uppercase">Forgot?</Link>
                </div>
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
                {isLoading ? "Authenticating..." : "Enter the Archive"}
              </Button>
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-[9px] tracking-[0.4em] uppercase">
                  <span className="bg-background px-4 text-foreground/30 font-light">OR</span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-[10px] tracking-widest text-foreground/40 uppercase">
                  Not a collector yet?
                </p>
                <Link
                  href={"/auth/register"}
                  className="inline-block text-[10px] tracking-[0.3em] uppercase text-primary hover:text-foreground transition-colors font-bold border-b border-primary/30 pb-1"
                >
                  Create an Profile
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
