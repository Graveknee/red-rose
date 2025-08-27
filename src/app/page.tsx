"use client";

import { main } from "framer-motion/client";
import { useEffect, useState } from "react";
import FrontpageMenu from "@/components/frontpage-menu";
import { useGuildData } from "@/hooks/useGuildData";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { preloadGuildData, loading, loadingProgress, categoryData, characterInfo } = useGuildData();

  // Only run client-side code after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      console.log('🏠 Frontpage: Starting preload...');
      preloadGuildData();
    }
  }, [preloadGuildData, isClient]);

  useEffect(() => {
    const path = document.querySelector("#XMLID_226_") as SVGPathElement;
    if (path) {
      // Delay the animation slightly for better visual impact
      setTimeout(() => {
        path.style.transition = "stroke-dashoffset 3s ease-in-out";
        path.style.strokeDashoffset = "0";
      }, 500);
    }
  }, []);

  // Mouse tracking for subtle parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Rose SVG positioned in upper left with elegant styling */}
      <div 
        className="absolute top-4 xl:left-80 left-[-24px] z-10 transform transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px) rotate(${mousePosition.x * 0.1}deg)`
        }}
      >
        <div className="relative">
          {/* Subtle glow effect behind the rose */}
          <div className="absolute inset-0 bg-rose-300 rounded-full blur-xl opacity-20 scale-150"></div>
          
          <svg
            version="1.1"
            stroke="#881337"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeMiterlimit="5"
            strokeDasharray="600"
            strokeDashoffset="600"
            className="w-190 h-190 relative z-10 drop-shadow-lg"
            viewBox="0 0 800 800"
          >
            <g id="XMLID_1_">
              <path
                id="XMLID_226_"
                style={{ fill: "none" }}
                d="M141.699,28.536c-2.719-3.544-7.022-6.085-11.414-6.835
                c-2.105-0.359-6.033-0.747-8.056,0.778c-0.305-7.745-10.111-13.968-17.049-14.642
                c-9.049-0.88-14.428,6.888-15.406,15.065c-0.365,0.047-0.732,0.107-1.099,0.184
                c-0.459-0.702-1.325-1.094-2.158-0.487c-8.092,5.89-7.658,17.458-7.172,26.443
                c0.281,5.203,1.126,11.636,4.52,15.655c-7.374-2.16-15.321-2.492-22.495,0.406
                c-1.172,0.473-1.625,2.113-0.37,2.834c4.502,2.587,9.244,4.39,14.419,5.047
                c2.825,0.358,6.831,0.662,10.224,0.028c-9.534,14.678-16.16,32.074-21.013,48.585
                c-5.567,18.938-9.501,39.34-8.952,59.159c0.045,1.608,2.265,1.527,2.442,0
                c2.293-19.73,4.852-38.943,10.878-57.955c5.417-17.091,13.362-32.521,21.249-48.39
                c1.132,6.821,5.351,12.99,10.382,17.646c0.838,0.775,2.139,0.429,2.485-0.656
                c1.311-4.11-0.961-9.879-2.424-13.72c-0.241-0.633-0.504-1.263-0.78-1.888
                c15.485,5.976,38.861-15.468,38.496-30.219c-0.01-0.394-0.185-0.698-0.432-0.916
                c-0.037-0.078-0.086-0.151-0.158-0.209c-0.191-0.152-0.396-0.284-0.596-0.421
                c2.162-0.547,4.081-1.58,5.662-3.782C145.555,36.521,144.309,31.938,141.699,28.536z"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Main content container - perfectly centered */}
      <div className="min-h-screen flex items-center justify-center relative z-20">
        <div className="max-w-5xl mx-auto px-8 py-12 text-center">
          {/* Hero title with enhanced typography */}
          <div className="mb-16 transform hover:scale-105 transition-transform duration-300">
            <h1 className="font-serif text-7xl md:text-8xl font-black bg-gradient-to-r from-rose-600 via-rose-800 to-pink-600 bg-clip-text text-transparent mb-6 tracking-tight leading-none">
              Red Rose
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto rounded-full shadow-lg"></div>
            <p className="text-rose-600/80 text-lg font-medium mt-4 tracking-wide">
              A Tibia Guild Since December 7th 1998
            </p>
          </div>

          {/* Enhanced bento grid container */}
          <div 
            className="transform transition-all duration-500"
            style={{
              transform: `translateY(${mousePosition.y * 0.1}px)`
            }}
          >
            {/* <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-rose-100 relative overflow-hidden"> */}
              {/* Subtle gradient overlay */}
              {/* <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50 rounded-3xl"></div> */}
              
              {/* Floating decorative elements */}
              {/* <div className="absolute top-4 right-4 w-3 h-3 bg-rose-300 rounded-full opacity-60 animate-ping"></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-pink-300 rounded-full opacity-60 animate-ping delay-500"></div>
               */}
              <div className="relative z-10">
                <FrontpageMenu />
              </div>
            {/* </div> */}
          </div>

          {/* Loading indicator with enhanced styling */}
          {isClient && loading && loadingProgress && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-100">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-rose-300 border-t-rose-600"></div>
                  <span className="text-rose-700 font-medium">Preparing your experience</span>
                </div>
                <div className="w-full bg-rose-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: '60%' }}
                  ></div>
                </div>
                <p className="text-rose-600/70 text-sm mt-2">{loadingProgress}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating particles for ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-rose-300 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-pink-300 rounded-full animate-float delay-1000 opacity-60"></div>
        <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-rose-400 rounded-full animate-float delay-2000 opacity-60"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}