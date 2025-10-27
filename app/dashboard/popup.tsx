"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, Rocket, Zap } from "lucide-react";

interface WelcomePopupProps {
    userId?: string | number;
}

export default function WelcomePopup({ userId }: WelcomePopupProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (!userId) return;

        // Create user-specific key
        const storageKey = `welcomePopupLastShown_${userId}`;
        const lastShown = localStorage.getItem(storageKey);
        const today = new Date().toDateString();

        if (lastShown !== today) {
            setIsVisible(true);
            setShowConfetti(true);

            // Hide confetti after 5 seconds
            setTimeout(() => {
                setShowConfetti(false);
            }, 5000);

            // Mark as shown today for this specific user
            localStorage.setItem(storageKey, today);
        }
    }, [userId]);

    const handleClose = () => {
        setIsVisible(false);
        setShowConfetti(false);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Confetti Animation */}
            {showConfetti && (
                <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
                    {[...Array(80)].map((_, i) => (
                        <div
                            key={i}
                            className="confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                backgroundColor: [
                                    "#0A84FF",
                                    "#BF5AF2",
                                    "#32D74B",
                                    "#FF9F0A",
                                    "#FF375F",
                                    "#5AC8FA",
                                    "#FFD60A",
                                    "#FF6482",
                                ][Math.floor(Math.random() * 8)],
                                width: `${Math.random() * 12 + 8}px`,
                                height: `${Math.random() * 12 + 8}px`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Backdrop */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-pink-900/80 backdrop-blur-xl z-[99] flex items-center justify-center p-4">
                {/* Popup Container */}
                <div className="relative max-w-xl w-full animate-scale-in">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[32px] blur-3xl opacity-40 animate-pulse" />

                    {/* Glass Card */}
                    <div className="relative rounded-[32px] border-2 border-white/40 backdrop-blur-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/95 via-blue-50/95 to-purple-50/95">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 animate-gradient" />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 backdrop-blur-xl transition-all duration-300 hover:rotate-90 hover:scale-110 shadow-lg"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>

                        {/* Content */}
                        <div className="relative p-6 md:p-8">
                            {/* Header with Icons */}
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Sparkles className="w-8 h-8 text-yellow-500 animate-spin-slow drop-shadow-lg" />
                                <h2 className="text-3xl md:text-4xl font-black text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                                    Welcome to New Build!
                                </h2>
                                <Rocket className="w-8 h-8 text-red-500 animate-bounce drop-shadow-lg" />
                            </div>

                            {/* Catchy Quote */}
                            <div className="mb-5 text-center bg-gradient-to-r from-blue-100/80 to-purple-100/80 rounded-xl p-4 border-2 border-blue-300/50 shadow-lg">
                                <p className="text-base md:text-lg font-bold text-gray-800 italic leading-relaxed">
                                    "Innovation distinguishes between a leader and a follower."
                                </p>
                            </div>

                            {/* Updates Section */}
                            <div className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl rounded-2xl p-5 border-2 border-blue-300/50 shadow-xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg animate-pulse">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        🎉 What's New in RR Tool
                                    </h3>
                                </div>

                                <div className="space-y-2.5">
                                    {[
                                        {
                                            title: "Reconciliation for One Month",
                                            icon: "📊",
                                            gradient: "from-blue-500 via-blue-600 to-cyan-500",
                                            glow: "shadow-blue-500/50",
                                        },
                                        {
                                            title: "Manual Refund Included",
                                            icon: "💰",
                                            gradient: "from-green-500 via-green-600 to-emerald-500",
                                            glow: "shadow-green-500/50",
                                        },
                                        {
                                            title: "New iOS 26 Glass Style UI",
                                            icon: "✨",
                                            gradient: "from-purple-500 via-purple-600 to-pink-500",
                                            glow: "shadow-purple-500/50",
                                        },
                                        {
                                            title: "Enhanced Features & Performance",
                                            icon: "🚀",
                                            gradient: "from-orange-500 via-red-500 to-red-600",
                                            glow: "shadow-orange-500/50",
                                        },
                                    ].map((update, index) => (
                                        <div
                                            key={index}
                                            className="group flex items-center gap-3 p-3 rounded-xl bg-white/80 hover:bg-white border-2 border-gray-200/50 hover:border-blue-300 transition-all duration-300 hover:translate-x-2 hover:shadow-lg cursor-pointer"
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg group-hover:scale-110 transition-transform">
                                                <span className="text-2xl">{update.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-800 font-bold text-base">
                                                    {update.title}
                                                </p>
                                            </div>
                                            <div
                                                className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${update.gradient} animate-pulse shadow-lg ${update.glow} group-hover:scale-150 transition-transform`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleClose}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-black text-base hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-2 border-white/50"
                                >
                                    Let's Get Started! 🎯
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0.3;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0.5) rotate(-5deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) rotate(2deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes gradient {
          0% {
            transform: translateX(0%) translateY(0%);
          }
          50% {
            transform: translateX(100%) translateY(100%);
          }
          100% {
            transform: translateX(0%) translateY(0%);
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .confetti {
          position: absolute;
          animation: fall 4s linear forwards;
          border-radius: 3px;
          box-shadow: 0 0 10px currentColor;
        }

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-gradient {
          animation: gradient 8s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
        </>
    );
}