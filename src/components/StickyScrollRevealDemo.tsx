
"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const content = [
  {
    title: "Upload Your Dataset",
    description:
      "Easily upload your dataset in multiple formats such as CSV, Excel, or JSON. Our platform ensures a smooth upload experience, validating your data for accuracy and compatibility.",
    content: (
      <div className="flex h-full w-full items-center justify-center p-4">
        <img
          src="/lovable-uploads/6871c7cc-fdf9-411e-97a3-3a0ad451e7bc.png"
          width={300}
          height={300}
          className="h-full w-full object-contain rounded-lg"
          alt="Upload Your Dataset"
        />
      </div>
    ),
  },
  {
    title: "Analyze the Dataset",
    description:
      "Leverage our AI-powered engine to process and analyze your dataset instantly. Get an overview of patterns, distributions, and anomalies without manual effort.",
    content: (
      <div className="flex h-full w-full items-center justify-center p-4">
        <img
          src="/lovable-uploads/1cdbeab5-9927-46b1-8296-c3ecb210fa8d.png"
          width={300}
          height={300}
          className="h-full w-full object-contain rounded-lg"
          alt="Analyze the Dataset"
        />
      </div>
    ),
  },
  {
    title: "Ask Your Queries",
    description:
      "Interact with your data using natural language queries. No need to write SQL or complex code—just ask questions, and our platform will handle the rest.",
    content: (
      <div className="flex h-full w-full items-center justify-center p-4">
        <img
          src="/lovable-uploads/1634a457-d877-49c8-8c6a-ab29e1f73870.png"
          width={300}
          height={300}
          className="h-full w-full object-contain rounded-lg"
          alt="Ask Your Queries"
        />
      </div>
    ),
  },
  {
    title: "Get Your Results",
    description:
      "Receive precise results with actionable insights, visualizations, and recommendations. Export your findings or share them directly with your team.",
    content: (
      <div className="flex h-full w-full items-center justify-center p-4">
        <img
          src="/lovable-uploads/b96760a9-e247-441e-a98b-81a9a0484c19.png"
          width={300}
          height={300}
          className="h-full w-full object-contain rounded-lg"
          alt="Get Your Results"
        />
      </div>
    ),
  },
];

export default function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Follow these simple steps to unlock insights from your data
          </p>
        </div>
        <StickyScroll content={content} />
      </div>
    </div>
  );
}
