"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceCard } from "@/components/services/ServiceCard";
import { BookOpen, Calculator, GraduationCap, School } from "lucide-react";

const levels = [
    {
        title: "Primaria",
        description: "Construimos bases sólidas. Apoyo en matemáticas, prácticas del lenguaje y ciencias.",
        icon: School,
        features: [
            "Ayuda con la tarea diaria",
            "Preparación para exámenes",
            "Técnicas de estudio iniciales",
            "Seguimiento personalizado"
        ]
    },
    {
        title: "Secundaria",
        description: "Acompañamiento integral para superar cada año con éxito y sin estrés.",
        icon: Calculator,
        features: [
            "Matemática, Física y Química",
            "Lengua y Literatura",
            "Inglés y otros idiomas",
            "Preparación para previas"
        ]
    },
    {
        title: "Terciario",
        description: "Soporte específico para tecnicaturas y profesorados.",
        icon: BookOpen,
        features: [
            "Análisis Matemático",
            "Álgebra y Geometría",
            "Estadística",
            "Redacción académica"
        ]
    },
    {
        title: "Grado Universitario",
        description: "Nivel experto para materias filtro y finales complejos.",
        icon: GraduationCap,
        features: [
            "Cálculo Avanzado",
            "Física I y II",
            "Química General e Inorgánica",
            "Asesoría de Tesis"
        ]
    }
];

export default function ClasesParticularesPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            <ServiceHero
                title="Clases Particulares"
                subtitle="Un enfoque personalizado para cada etapa de tu vida académica. Desde los primeros pasos hasta el título universitario."
                gradientFrom="from-blue-500"
                gradientTo="to-cyan-500"
            />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {levels.map((level, index) => (
                        <ServiceCard
                            key={level.title}
                            {...level}
                            delay={index * 0.1}
                        />
                    ))}
                </div>

                {/* Methodology Section */}
                <div className="mt-32 max-w-4xl mx-auto text-center space-y-12">
                    <h2 className="text-3xl font-bold font-heading">¿Por qué elegirnos?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Personalización Total</h3>
                            <p className="text-gray-400 text-sm">Adaptamos el ritmo y la metodología a tu forma de aprender. No hay dos alumnos iguales.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Profesores Expertos</h3>
                            <p className="text-gray-400 text-sm">Equipo seleccionado rigurosamente, no solo por conocimiento, sino por capacidad pedagógica.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Flexibilidad</h3>
                            <p className="text-gray-400 text-sm">Horarios adaptables y modalidad online o presencial según disponibilidad.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
