"use client";

import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
    {
        id: "secondary",
        title: "Clases Particulares",
        description: "Apoyo escolar integral, preparación para exámenes y orientación vocacional. Tu compañero de estudio ideal.",
        icon: BookOpen,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        href: "/servicios/clases-particulares",
    },
    {
        id: "university",
        title: "Cursos de Ingreso",
        description: "Dominá las materias filtro. Clases intensivas para parciales, finales y tesis de grado.",
        icon: GraduationCap,
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        href: "/servicios/ingreso",
    },
    {
        id: "olympiads",
        title: "Olimpíadas",
        description: "Entrenamiento de alto rendimiento para competencias matemáticas. Desafía tu mente al máximo nivel.",
        icon: Trophy,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        href: "/servicios/olimpiadas",
    },
];

export function Services() {
    return (
        <section id="services" className="py-20 relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading">
                        Nuestros Programas
                    </h2>
                    <p className="text-gray-400">
                        Diseñados para cada etapa de tu desarrollo académico.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-8 rounded-2xl glass hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 rounded-xl ${service.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <service.icon className={`w-7 h-7 ${service.color}`} />
                            </div>

                            <h3 className="text-xl font-bold mb-3 font-heading">{service.title}</h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                {service.description}
                            </p>

                            <Link
                                href={service.href}
                                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-primary transition-colors"
                                aria-label={`Ver más sobre ${service.title}`}
                            >
                                Ver más sobre {service.title}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
