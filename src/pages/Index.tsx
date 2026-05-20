
import React from 'react';
import ResizableNavbarDemo from '@/components/ResizableNavbarDemo';
import HeroScrollDemo from '@/components/HeroScrollDemo';
import HowItWorks from '@/components/HowItWorks';
import AppWorkspace from '@/components/AppWorkspace';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ResizableNavbarDemo />
      
      {/* Hero Section with Scroll Animation - Added proper spacing to prevent navbar overlap */}
      <main className="pt-28">
        <HeroScrollDemo />
        
        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="container mx-auto px-4">
            <Button className="btn-primary text-lg px-8 py-4">
              Start Analyzing Your Data
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Free tier available
            </p>
          </div>
        </section>

        <HowItWorks />
        <AppWorkspace />
        
        {/* Status Banner */}
        <section className="py-8 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="live-indicator"></div>
              <span className="text-foreground font-medium">System Status: All services operational</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
