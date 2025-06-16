// components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Globe, Cctv, Vote } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Secure Elections",
    description: "Tamper-proof voting systems",
  },
  {
    icon: <Cctv className="h-6 w-6" />,
    title: "Smart Surveillance",
    description: "AI-powered monitoring",
  },
  {
    icon: <Vote className="h-6 w-6" />,
    title: "Transparent Results",
    description: "Real-time auditing",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Standards",
    description: "ISO-certified solutions",
  },
];

export function HeroSection() {
  return (
    <section className="relative  overflow-hidden">
      {/* Animated Background */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 " />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-3xl"
        />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          {/* Animated Headline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Revolutionizing Digital Governance</h1>
          </motion.div>

          {/* Animated Subheadline */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 text-lg leading-8 text-muted-foreground">
            INET Systems delivers cutting-edge election monitoring, examination security, and surveillance solutions trusted by governments worldwide.
          </motion.p>

          {/* Animated CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-10 flex flex-wrap gap-6">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              View Case Studies
            </Button>
          </motion.div>

          {/* Animated Features Grid */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-xl border p-4 backdrop-blur-sm hover:bg-accent/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{feature.icon}</div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Animated Hero Image/Illustration */}
        <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-16 hidden lg:mt-0 lg:flex lg:flex-shrink-0 lg:justify-end">
          <div className="relative w-[400px] h-[400px] rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-1 shadow-lg">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-background">
              {/* Replace with your actual image or illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                >
                  INET
                </motion.div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/4 h-16 w-16 rounded-full bg-primary/20"
              />
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  x: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-1/4 right-1/4 h-20 w-20 rounded-full bg-secondary/20"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
