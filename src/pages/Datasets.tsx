
import React from 'react';
import ResizableNavbarDemo from '@/components/ResizableNavbarDemo';
import Footer from '@/components/Footer';
import { Tiles } from '@/components/ui/tiles';
import { Database } from 'lucide-react';

const Datasets = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ResizableNavbarDemo />
      
      {/* Enhanced Tiles Background with better contrast */}
      <div className="absolute inset-0 z-0">
        <Tiles 
          rows={50} 
          cols={20} 
          tileSize="md"
          className="opacity-40"
          tileClassName="border-polaris-purple/20 shadow-sm shadow-polaris-purple/10"
        />
        {/* Enhanced gradient overlay with deeper contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-galactic-green/15 via-lightyear-lavender/10 to-polaris-purple/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-background/20"></div>
      </div>

      {/* Main content with proper spacing to prevent navbar overlap */}
      <main className="pt-28 relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Enhanced Sample Dataset 1 */}
            <div className="glass-morphic rounded-2xl p-8 text-center border border-polaris-purple/30 shadow-2xl shadow-polaris-purple/20 hover:shadow-polaris-purple/40 hover:-translate-y-1 hover:scale-[1.02] hover:border-galactic-green/50 transition-all duration-500 ease-out backdrop-blur-xl bg-gradient-to-br from-galactic-green/10 to-polaris-purple/10 group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-galactic-green/20 flex items-center justify-center border border-galactic-green/30 shadow-lg shadow-galactic-green/20 group-hover:shadow-galactic-green/40 transition-all duration-300">
                <Database className="w-8 h-8 text-galactic-green" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Sample Dataset 1
              </h2>
              <p className="text-muted-foreground mb-6">
                Explore our curated sample dataset for analysis and insights.
              </p>
              <button className="btn-primary w-full hover:shadow-lg hover:shadow-galactic-green/30 transition-all duration-300">
                Load Dataset
              </button>
            </div>

            {/* Enhanced Sample Dataset 2 */}
            <div className="glass-morphic rounded-2xl p-8 text-center border border-polaris-purple/30 shadow-2xl shadow-polaris-purple/20 hover:shadow-polaris-purple/40 hover:-translate-y-1 hover:scale-[1.02] hover:border-lightyear-lavender/50 transition-all duration-500 ease-out backdrop-blur-xl bg-gradient-to-br from-lightyear-lavender/10 to-polaris-purple/10 group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-lightyear-lavender/20 flex items-center justify-center border border-lightyear-lavender/30 shadow-lg shadow-lightyear-lavender/20 group-hover:shadow-lightyear-lavender/40 transition-all duration-300">
                <Database className="w-8 h-8 text-lightyear-lavender" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Sample Dataset 2
              </h2>
              <p className="text-muted-foreground mb-6">
                Another comprehensive dataset ready for your analytical needs.
              </p>
              <button className="btn-primary w-full hover:shadow-lg hover:shadow-lightyear-lavender/30 transition-all duration-300">
                Load Dataset
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Datasets;
