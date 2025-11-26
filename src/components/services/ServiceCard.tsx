"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    delay?: number;
    features?: string[];
}

export function ServiceCard({ title, description, icon: Icon, delay = 0, features }: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors group"
        >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
            </div>

            <h3 className="text-xl font-bold font-heading mb-3">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {description}
            </p>

            {features && (
                <ul className="space-y-2">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            {feature}
                        </li>
                    ))}
                </ul>
            )}
        </motion.div>
    );
}
