import React from "react";
import { Pencil, Share2, Layers, Zap, ChevronRight } from "lucide-react";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import Link from "next/link";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 lg:py-32">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Create, Collaborate, Excel
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                The powerful whiteboarding tool that brings your ideas to life.
                Draw, diagram, and collaborate in real-time with unmatched
                simplicity.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/signin">
                  <Button className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    Signin <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href={"/signup"}>
                  <Button className="px-8 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2">
                    SignUp <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card
              icon={<Pencil className="w-6 h-6 text-indigo-600" />}
              title="Intuitive Drawing"
              description="Smooth, responsive drawing experience with customizable tools and shapes."
            />
            <Card
              icon={<Share2 className="w-6 h-6 text-indigo-600" />}
              title="Real-time Collaboration"
              description="Work together with your team in real-time, anywhere in the world."
            />
            <Card
              icon={<Layers className="w-6 h-6 text-indigo-600" />}
              title="Infinite Canvas"
              description="Never run out of space with our infinite canvas technology."
            />
            <Card
              icon={<Zap className="w-6 h-6 text-indigo-600" />}
              title="Lightning Fast"
              description="Optimized performance for smooth drawing and interaction."
            />
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Ideas, Visualized
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From quick sketches to complex diagrams, Excellidraw helps you
              bring your ideas to life with powerful tools and features.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=2000&q=80"
              alt="Excellidraw Interface"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white">Excellidraw</h3>
              <p className="mt-2">Drawing excellence, delivered.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Blog
              </a>
              <a href="#" className="hover:text-white transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} Excellidraw. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
