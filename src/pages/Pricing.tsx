import React from 'react';
import ResizableNavbarDemo from '@/components/ResizableNavbarDemo';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ResizableNavbarDemo />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-polaris-purple/20 via-lightyear-lavender/10 to-galactic-green/15"></div>
      </div>

      <main className="pt-28 relative z-10 min-h-screen">
        <div className="container mx-auto px-4 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-polaris-purple/20 border border-polaris-purple/30 mb-4">
              <Sparkles className="w-7 h-7 text-polaris-purple" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Simple, transparent pricing</h1>
            <p className="text-muted-foreground">Choose a plan that fits your needs. Prices in INR (₹).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="glass-morphic border-polaris-purple/30 shadow-xl shadow-polaris-purple/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-foreground">Free</span>
                  <span className="text-2xl font-extrabold text-foreground">₹0<span className="text-sm font-normal text-muted-foreground">/month</span></span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-galactic-green" /> Basic usage</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-galactic-green" /> Limited datasets (up to 3)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-galactic-green" /> Limited queries per day</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-galactic-green" /> Standard processing</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="glass-morphic border-polaris-purple/50 shadow-2xl shadow-polaris-purple/30 relative">
              <div className="absolute -top-3 right-4 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-polaris-purple text-white border border-polaris-purple/70">
                <Crown className="w-3 h-3" /> Popular
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-foreground">Pro</span>
                  <span className="text-2xl font-extrabold text-foreground">₹799<span className="text-sm font-normal text-muted-foreground">/month</span></span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-galactic-green" /> Unlimited datasets</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-galactic-green" /> Advanced analytics features</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-galactic-green" /> Priority processing & support</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-galactic-green" /> Early access to new models</li>
                </ul>
                <Button className="w-full mt-6 bg-polaris-purple hover:bg-polaris-purple/90 text-white">Upgrade to Pro</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;


