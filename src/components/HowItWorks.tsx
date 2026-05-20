
import React from 'react';
import { MessageSquare, Database, BarChart3 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: "Ask Questions",
      description: "Simply type your question in natural language. Our AI understands what you're looking for.",
      color: "card-green"
    },
    {
      icon: Database,
      title: "Generate SQL",
      description: "Watch as your question transforms into optimized SQL queries automatically.",
      color: "card-lavender"
    },
    {
      icon: BarChart3,
      title: "Get Insights",
      description: "Receive clear visualizations and explanations of your data insights instantly.",
      color: "card-purple"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three simple steps to transform your data questions into actionable insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${step.color} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
            >
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-lg opacity-90">{step.description}</p>
              <div className="mt-6 text-3xl font-bold opacity-20">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
