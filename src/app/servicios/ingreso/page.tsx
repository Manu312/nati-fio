"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Building2, Library } from "lucide-react";

const courses = [
    {
        title: "Ingreso a Secundario",
        description: "Preparación exclusiva para colegios de alta exigencia académica.",
        icon: Library,
        features: [
            "Colegio Nacional de Buenos Aires (CNBA)",
            "Escuela Superior de Comercio Carlos Pellegrini",
            "Instituto Libre de Segunda Enseñanza (ILSE)",
            "Simulacros de examen semanales"
        ]
    },
    {
        title: "Ingreso a Facultad",
        description: "Asegurá tu lugar en la universidad. Cursos nivelatorios y de ingreso.",
        icon: Building2,
        features: [
            "Ciclo Básico Común (CBC - UBA)",
            "UBA XXI",
            "Ingreso UTN / ITBA",
            "Universidades Privadas (UCA, Austral, UADE)"
        ]
    }
];

export default function IngresoPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            <ServiceHero
                title="Cursos de Ingreso"
                subtitle="La preparación que marca la diferencia. Entrá al colegio o universidad que soñás con la seguridad de estar listo."
                gradientFrom="from-purple-500"
                gradientTo="to-pink-500"
            />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {courses.map((course, index) => (
                        <ServiceCard
                            key={course.title}
                            {...course}
                            delay={index * 0.1}
                        />
                    ))}
                </div>

                <div className="mt-20 p-8 rounded-2xl glass border border-white/10 max-w-3xl mx-auto text-center">
                    <h3 className="text-2xl font-bold font-heading mb-4">¿Por qué prepararse con nosotros?</h3>
                    <p className="text-gray-400 mb-8">
                        Nuestros cursos no solo enseñan el temario, sino que entrenan la estrategia de examen.
                        Manejo del tiempo, resolución de problemas bajo presión y confianza.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 rounded-lg bg-white/5">
                            <div className="text-2xl font-bold text-primary mb-1">+500</div>
                            <div className="text-xs text-gray-400">Ingresantes</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5">
                            <div className="text-2xl font-bold text-primary mb-1">90%</div>
                            <div className="text-xs text-gray-400">Tasa de Aprobación</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5">
                            <div className="text-2xl font-bold text-primary mb-1">15+</div>
                            <div className="text-xs text-gray-400">Años de Experiencia</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5">
                            <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                            <div className="text-xs text-gray-400">Soporte Online</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
