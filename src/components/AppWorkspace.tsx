
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Play, Save, Download, Settings } from 'lucide-react';

const AppWorkspace = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Your AI-Powered Workspace
          </h2>
          <p className="text-xl text-muted-foreground">
            Experience the future of data analysis
          </p>
        </div>

        <div className="max-w-7xl mx-auto bg-card rounded-3xl shadow-2xl overflow-hidden border border-border">
          <div className="flex h-[600px]">
            {/* Sidebar */}
            <div className="w-64 bg-secondary p-6 border-r border-border">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/10">
                  <div className="w-2 h-2 rounded-full bg-galactic-green"></div>
                  <span className="font-medium">Ask a question</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span>Load dataset</span>
                </div>
                <div className="pt-4">
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-70">Views</h4>
                  <div className="space-y-2">
                    <div className="p-2 text-sm hover:bg-white/5 rounded-lg cursor-pointer">Questions</div>
                    <div className="p-2 text-sm hover:bg-white/5 rounded-lg cursor-pointer">Datasets</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Chat Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4 max-w-4xl">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl rounded-br-lg max-w-md">
                      What were the top-selling products last quarter?
                    </div>
                  </div>
                  
                  {/* Assistant Response */}
                  <div className="flex justify-start">
                    <div className="bg-accent text-accent-foreground px-6 py-4 rounded-2xl rounded-bl-lg max-w-2xl">
                      <div className="mb-3">
                        <h4 className="font-semibold mb-2">Analysis</h4>
                        <p className="text-sm">Product A saw the highest sales last quarter, with total revenue of $309,000.</p>
                      </div>
                      
                      {/* Mock Data Table */}
                      <div className="bg-white/20 rounded-lg p-3 mt-3">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-white/20">
                              <th className="text-left p-1">Product</th>
                              <th className="text-right p-1">Sales</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td className="p-1">Product A</td><td className="text-right p-1">$309,000</td></tr>
                            <tr><td className="p-1">Product B</td><td className="text-right p-1">$305,000</td></tr>
                            <tr><td className="p-1">Product C</td><td className="text-right p-1">$293,000</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-border">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Ask a question about your data..."
                      className="w-full p-4 pr-12 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <Button size="sm" className="absolute right-2 top-2 h-8 w-8 p-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* SQL Panel */}
            <div className="w-80 bg-blackhole-burgundy text-nebula-neutral p-6 border-l border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Generated SQL</h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    <Play className="w-3 h-3 mr-1" />
                    Run
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    <Save className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 font-mono text-xs">
                <div className="text-galactic-green">SELECT</div>
                <div className="ml-4">product,</div>
                <div className="ml-4">SUM(sales) AS total_sales</div>
                <div className="text-galactic-green">FROM</div>
                <div className="ml-4">sales</div>
                <div className="text-galactic-green">GROUP BY</div>
                <div className="ml-4">product</div>
                <div className="text-galactic-green">ORDER BY</div>
                <div className="ml-4">total_sales DESC;</div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-sm">Results</h4>
                  <div className="flex space-x-1">
                    <button className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs">
                      Table
                    </button>
                    <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-xs">
                      Chart
                    </button>
                  </div>
                </div>
                <div className="text-xs opacity-75">
                  Your data remains secure<br />
                  and encrypted at all times
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppWorkspace;
