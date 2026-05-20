
import React from 'react';
import { Database, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blackhole-burgundy text-nebula-neutral py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-polaris-purple flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AI Data Analyst</span>
            </div>
            <p className="text-sm opacity-80">
              Transforming data analysis with the power of artificial intelligence.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-galactic-green hover:text-blackhole-burgundy transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-galactic-green hover:text-blackhole-burgundy transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-galactic-green hover:text-blackhole-burgundy transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-galactic-green hover:text-blackhole-burgundy transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-galactic-green transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-galactic-green transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-galactic-green transition-colors">API</a></li>
              <li><a href="#" className="hover:text-galactic-green transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-galactic-green transition-colors">About</a></li>
              <li><a href="#" className="hover:text-galactic-green transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-galactic-green transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-galactic-green transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-galactic-green transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-galactic-green transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-galactic-green transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-galactic-green transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-60">
            © 2024 AI Data Analyst. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <div className="live-indicator"></div>
              <span className="text-xs opacity-60">Connected to Dataset Stream</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
