import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your work email");

    const redirectTo = `${import.meta.env.VITE_SITE_URL}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      toast.error("Unable to send reset link", { description: error.message });
      return;
    }

    setSent(true);
    toast.success("Password reset link sent");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <p className="font-display font-bold text-lg">Gavit HR <span className="text-primary">AI</span></p>
        </div>

        <div className="rounded-2xl border bg-card p-7 shadow-sm">
          {!sent ? (
            <>
              <h1 className="font-display font-bold text-2xl">Forgot password?</h1>
              <p className="text-sm text-muted-foreground mt-1.5">Enter your work email and we'll send a reset link.</p>
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="h-11" />
                </div>
                <Button type="submit" className="w-full h-11 font-semibold">Send reset link</Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="h-14 w-14 rounded-2xl bg-success-soft text-success grid place-items-center mx-auto mb-4">
                <MailCheck className="h-7 w-7" />
              </div>
              <h2 className="font-display font-bold text-xl">Check your inbox</h2>
              <p className="text-sm text-muted-foreground mt-2">We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>.</p>
              <Button className="mt-6 w-full" onClick={() => navigate("/reset-password")}>Continue to reset</Button>
            </div>
          )}
        </div>

        <Link to="/login" className="mt-5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
