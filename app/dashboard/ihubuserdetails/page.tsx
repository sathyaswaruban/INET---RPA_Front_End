"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { userCards } from "@/app/data/userCards";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import Loader from "../loader/page";

interface User {
    id: number;
    email: string;
    name: string;
    role: "ADMIN" | "USER";
    createdAt: string;
}

export default function IhubUserDetails() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user info
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/auth/me");
                setUser(response?.data?.user);
            } catch (error) {
                toast.error("Failed to fetch user data");
                router.push("/auth/login");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    if(isLoading){
        <Loader/>
    }

    return (
        <div className="flex flex-col bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8">
            <div className="flex items-start mb-8">
                <h1 className="text-2xl font-bold text-[var(--primary)]">
                    IHUB User Details
                </h1>
            </div>
            <div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {userCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card
                            key={card.value}
                            onClick={() =>
                                router.push(`/dashboard/userdetailsform/${card.value}`)
                            }
                            className="glass-card hover-glow cursor-pointer p-0 m-0 relative hover:scale-105"
                        >
                            <CardContent className={`card-content flex flex-col items-center text-center h-full text-white ${card.bgColor} p-6 rounded-xl`}>
                                <Icon size={40} className="mb-4" />
                                <p className="font-semibold text-xl">{card.key}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
