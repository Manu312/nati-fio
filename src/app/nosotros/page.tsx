"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { motion } from "framer-motion";
import { Award, BookOpen, Star, Users } from "lucide-react";
import Image from "next/image";

const teachers = [
    {
        name: "Naty",
        role: "Fundadora & Directora Académica",
        bio: "Especialista en Matemática Educativa con más de 10 años de experiencia. Apasionada por transformar la ansiedad matemática en confianza.",
        stats: [
            { label: "Años Exp.", value: "10+" },
            { label: "Alumnos", value: "1k+" },
        ],
        tags: ["Matemática", "Física", "Ingreso CNBA"],
        image: "/placeholder-naty.jpg" // In a real app, this would be a real image
    },
    {
        name: "Fio",
        role: "Co-Fundadora & Coordinadora de Ingresos",
        bio: "Ingeniera con vocación docente. Experta en metodologías de estudio para exámenes de alto rendimiento y nivel universitario.",
        stats: [
            { label: "Años Exp.", value: "8+" },
            { label: "Efectividad", value: "95%" },
        ],
        tags: ["Análisis Matemático", "Química", "Ingreso UTN"],
        image: "/placeholder-fio.jpg"
    }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            <ServiceHero
                title="Nuestra Filosofía"
                subtitle="Creemos que la excelencia no es un acto, sino un hábito. Formamos estudiantes autónomos, críticos y seguros de sí mismos."
                gradientFrom="from-indigo-500"
                gradientTo="to-violet-500"
            />

            <div className="container mx-auto px-4 md:px-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {[
                        { icon: Users, value: "2000+", label: "Estudiantes" },
                        { icon: Star, value: "4.9/5", label: "Calificación" },
                        { icon: Award, value: "15+", label: "Años Combinados" },
                        { icon: BookOpen, value: "5000+", label: "Clases Dictadas" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-6 rounded-2xl text-center border border-white/10"
                        >
                            <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Team Section */}
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold font-heading text-center mb-12">Conocé a tus Mentoras</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {teachers.map((teacher, index) => (
                            <motion.div
                                key={teacher.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="glass rounded-3xl overflow-hidden border border-white/10 group hover:border-primary/30 transition-colors"
                            >
                                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                                    {/* Placeholder for Teacher Image */}
                                    <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center text-2xl font-bold">
                                        {teacher.name[0]}
                                    </div>
                                </div>
                                <div className="pt-16 p-8">
                                    <h3 className="text-2xl font-bold font-heading">{teacher.name}</h3>
                                    <p className="text-primary font-medium text-sm mb-4">{teacher.role}</p>
                                    <p className="text-gray-400 leading-relaxed mb-6">
                                        {teacher.bio}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-white/5">
                                        {teacher.stats.map((s) => (
                                            <div key={s.label}>
                                                <div className="text-lg font-bold text-white">{s.value}</div>
                                                <div className="text-xs text-gray-500">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {teacher.tags.map((tag) => (
                                            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
