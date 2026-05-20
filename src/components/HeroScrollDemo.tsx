
"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden bg-background">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-gradient">
                AI Data Analysis
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mt-6 max-w-3xl mx-auto">
              Transform your data into insights with natural language queries and intelligent analysis
            </p>
          </>
        }
      >
        <img
          src="/lovable-uploads/befd6789-b648-416a-a8ac-5b5abc31e3a2.png"
          alt="AI Data Analyst Interface"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top shadow-2xl"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
