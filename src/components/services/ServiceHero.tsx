"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface ServiceHeroProps {
    title: string;
    subtitle: string;
    gradientFrom?: string;
    gradientTo?: string;
}

export function ServiceHero({
    title,
    subtitle,
    gradientFrom = "from-primary",
    gradientTo = "to-secondary"
}: ServiceHeroProps) {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-30 pointer-events-none">
                <div className={cn("absolute top-20 left-1/4 w-96 h-96 rounded-full blur-[100px] bg-gradient-to-r", gradientFrom, gradientTo)} />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight"
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                >
                    {subtitle}
                </motion.p>
            </div>
        </section>
    );
}
