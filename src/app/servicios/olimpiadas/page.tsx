"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Brain, Medal, Target, Trophy } from "lucide-react";

const features = [
    {
        title: "Entrenamiento OMA / Ñandú",
        description: "Preparación específica para las competencias nacionales e internacionales.",
        icon: Trophy,
        features: [
            "Resolución de problemas de certámenes anteriores",
            "Estrategias de pensamiento lateral",
            "Simulacros cronometrados",
            "Material teórico exclusivo"
        ]
    },
    {
        title: "Matemática Avanzada",
        description: "Para apasionados que quieren ir más allá del currículo escolar.",
        icon: Brain,
        features: [
            "Teoría de Números",
            "Geometría Avanzada",
            "Combinatoria",
            "Álgebra Superior"
        ]
    }
];

export default function OlimpiadasPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            <ServiceHero
                title="Entrenamiento Olímpico"
                subtitle="Desafía tu mente. Preparación de alto rendimiento para estudiantes que buscan la excelencia matemática."
                gradientFrom="from-yellow-500"
                gradientTo="to-orange-500"
            />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
                    {features.map((feature, index) => (
                        <ServiceCard
                            key={feature.title}
                            {...feature}
                            delay={index * 0.1}
                        />
                    ))}
                </div>

                {/* Gamification / Stats Section */}
                <div className="relative rounded-3xl overflow-hidden glass border border-white/10 p-8 md:p-12">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/10 to-orange-500/10 -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                <Medal className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Nivel Elite</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold font-heading">
                                Más que una clase, <br />
                                <span className="text-yellow-400">un deporte mental.</span>
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                Nuestro método se basa en el desafío constante. Fomentamos la creatividad, la lógica y la perseverancia.
                                No se trata solo de saber fórmulas, sino de saber pensar.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Target className="w-5 h-5 text-yellow-400" />
                                    <span>Mentoria personalizada con ex-olímpicos</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Target className="w-5 h-5 text-yellow-400" />
                                    <span>Comunidad de estudiantes de alto nivel</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Target className="w-5 h-5 text-yellow-400" />
                                    <span>Acceso a competencias internacionales</span>
                                </li>
                            </ul>
                        </div>

                        <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden group">
                            {/* Abstract representation of a problem solving graph */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-80 transition-opacity duration-500">
                                <div className="w-40 h-40 border-2 border-yellow-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                                <div className="absolute w-28 h-28 border-2 border-orange-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                                <div className="absolute w-16 h-16 bg-yellow-500/20 rounded-full blur-xl animate-pulse" />
                            </div>
                            <div className="relative z-10 text-center">
                                <div className="text-5xl font-bold text-white mb-2">100+</div>
                                <div className="text-sm text-gray-400 uppercase tracking-widest">Medallas Obtenidas</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
