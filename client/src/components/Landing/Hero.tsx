import React from "react";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-16 sm:py-20 md:py-28">
      
      {/* Title */}
      <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-amber-300 to-yellow-500 text-transparent bg-clip-text">
        CodeVex
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl">
        GitHub insights that GitHub doesn’t show
      </p>

      {/* Description */}
      <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-400 max-w-xl">
        DevScore, AI insights, and developer comparison
      </p>

     

    </section>
  );
};

export default Hero;
