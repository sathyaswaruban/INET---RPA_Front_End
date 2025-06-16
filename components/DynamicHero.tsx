// components/DynamicHero.tsx
"use client";

import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Globe, Cctv, Vote, ChevronsRight } from "lucide-react";
import { useEffect } from "react";

const features = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Secure Elections",
    description: "Tamper-proof systems",
  },
  {
    icon: <Cctv className="h-6 w-6" />,
    title: "Smart Surveillance",
    description: "AI monitoring",
  },
  {
    icon: <Vote className="h-6 w-6" />,
    title: "Transparent Results",
    description: "Real-time audits",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Standards",
    description: "ISO-certified",
  },
];

export function DynamicHero() {
  // Animated values for background gradients
  const color = useMotionValue(0);
  //   const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%,
  //     hsl(${color}, 80%, 55%) 0%,
  //     hsl(${color}, 80%, 35%) 50%,
  //     hsl(${color}, 100%, 15%) 100%)`;

  // Continuous color cycling
  useEffect(() => {
    animate(color, [0, 60, 120, 180, 240, 300, 360], {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    });
  }, [color]);

  // Floating animation for feature cards
  const floatingVariants = {
    initial: { y: 0 },
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Text reveal animation
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const title = "Digital Governance Revolution";

  return (
    <section className="relative overflow-hidden">
      {/* Dynamic gradient background */}
      {/* style={{ backgroundImage }} */}
      <motion.div className="absolute inset-0 z-0">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: Math.random() * 0.5 + 0.5,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: [0, 0.3, 0],
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24  lg:flex lg:items-center lg:gap-x-10 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          {/* Animated headline with character reveal */}
          <motion.div variants={textVariants} initial="hidden" animate="visible" className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {title.split(" ").map((word, wordIndex) => (
                <motion.span key={wordIndex} className="inline-block mr-2 whitespace-nowrap" variants={textVariants}>
                  {word.split("").map((char, charIndex) => (
                    <motion.span key={charIndex} className="inline-block" variants={letterVariants} whileHover={{ y: -5, color: "hsl(var(--primary))" }}>
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          {/* Animated subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.8 },
            }}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            INET Systems delivers cutting-edge election monitoring, examination security, and surveillance solutions trusted by governments Nationwide.
          </motion.p>

          {/* Animated CTA buttons with trail effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 1 },
            }}
            className="mt-10 flex flex-wrap gap-6"
          >
            <Button size="lg" className="group relative overflow-hidden">
              <motion.span className="absolute inset-0 bg-primary/10" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.6 }} />
              <span className="relative flex items-center">
                Get Started
                <motion.span
                  className="ml-2"
                  animate={{
                    x: [0, 5, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                    },
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </span>
            </Button>

            <Button variant="outline" size="lg">
              View Case Studies
            </Button>
          </motion.div>

          {/* Feature grid with floating animation */}
          <motion.div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={floatingVariants}
                initial="initial"
                animate="float"
                custom={index}
                whileHover={{
                  y: 20,
                  scale: 1.05,
                  backgroundColor: "hsl(var(--accent))",
                  transition: { duration: 0.3 },
                }}
                className="rounded-xl border p-4 backdrop-blur-sm bg-background/50 hover:shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <motion.div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary" whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.6 }}>
                    {feature.icon}
                  </motion.div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Animated illustration with continuous motion */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { delay: 0.5 },
          }}
          className="mt-16 hidden lg:mt-0 lg:flex lg:flex-shrink-0 lg:justify-end"
        >
          <div className="relative w-[400px] h-[400px]">
            {/* Main card with floating animation */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-1 shadow-2xl"
              animate={{
                rotate: [0, 2, -2, 0],
                transition: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-background/80 backdrop-blur-sm">
                {/* Animated logo */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.05, 1],
                    transition: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <motion.h2
                    className="text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    animate={{
                      opacity: [0.8, 1, 0.8],
                      transition: {
                        duration: 4,
                        repeat: Infinity,
                      },
                    }}
                  >
                    INET
                  </motion.h2>
                </motion.div>

                {["development", "surveillance", "security", "cloud"].map((tech, i) => {
                  const containerWidth = 400;
                  const containerHeight = 400;
                  const elementWidth = 80;
                  const elementHeight = 30;

                  const xRange = containerWidth - elementWidth;
                  const yRange = containerHeight - elementHeight;

                  // Generate path with multiple points
                  const path = Array.from({ length: 5 }).map((_, idx) => ({
                    x: Math.random() * xRange,
                    y: Math.random() * yRange,
                  }));

                  return (
                    <motion.div
                      key={tech}
                      className="absolute bg-background border rounded-lg px-3 py-1 text-xs font-medium shadow-sm"
                      initial={{
                        x: path[0].x,
                        y: path[0].y,
                        opacity: 1,
                      }}
                      animate={{
                        x: path.map((p) => p.x),
                        y: path.map((p) => p.y),
                        transition: {
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                          times: path.map((_, i) => i / (path.length - 1)),
                        },
                      }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "hsl(var(--accent))",
                        transition: { duration: 0.3 },
                      }}
                    >
                      {tech}
                      <ChevronsRight className="inline ml-1 h-3 w-3 text-primary" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
