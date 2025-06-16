// components/PageTransitionWrapper.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = (url: string) => url !== pathname && setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    const handleRouteChange = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500); // Simulate loading delay
    };

    router.push(pathname);
    handleRouteChange();

    return () => {
      setIsLoading(false);
    };
  }, [pathname, router]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              {/* <p className="text-sm text-muted-foreground">Loading page...</p> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
