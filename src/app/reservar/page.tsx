"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, ChevronRight, MessageCircle, User, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { UserRole } from "@/types";

const services = [
    { id: "particular", name: "Clases Particulares" },
    { id: "ingreso", name: "Ingreso (Secundario/Facultad)" },
    { id: "olimpiadas", name: "Entrenamiento Olimpíadas" },
];

const subjects = [
    { id: "math", name: "Matemática" },
    { id: "physics", name: "Física" },
    { id: "chemistry", name: "Química" },
    { id: "other", name: "Otra / Consulta General" },
];

export default function BookingPage() {
    const { isAuthenticated, user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        service: "",
        subject: "",
        name: "",
        message: "",
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const generateWhatsAppLink = () => {
        const text = `Hola Naty & Fio! 👋%0A%0AQuiero reservar una clase.%0A%0A*Servicio:* ${services.find(s => s.id === formData.service)?.name}%0A*Materia:* ${subjects.find(s => s.id === formData.subject)?.name}%0A*Nombre:* ${formData.name}%0A*Mensaje:* ${formData.message}`;
        return `https://wa.me/5491178268810?text=${text}`;
    };

    // Si el usuario está autenticado y es alumno, redirigir al panel de alumno
    const isAlumno = isAuthenticated && user?.roles?.includes(UserRole.ALUMNO);

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-heading mb-4">Reserva tu Clase</h1>
                    <p className="text-gray-400">Completa los pasos para coordinar tu primera sesión.</p>
                </div>

                {/* Si es alumno autenticado, mostrar acceso al panel */}
                {isAlumno && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-6 glass rounded-2xl border border-green-500/30 bg-green-500/10"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-green-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white">¡Hola, {user?.email}!</h3>
                                <p className="text-gray-400 text-sm">Accede a tu panel para reservar clases con profesores disponibles</p>
                            </div>
                            <Link
                                href="/alumno/reservar"
                                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
                            >
                                <Calendar className="w-5 h-5" />
                                Ir a Reservar
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* Si NO es alumno, mostrar opciones */}
                {!isAlumno && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-6 glass rounded-2xl border border-primary/30"
                    >
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-semibold text-white mb-2">¿Sos alumno registrado?</h3>
                            <p className="text-gray-400 text-sm">Inicia sesión para reservar clases directamente con nuestros profesores</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/login"
                                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <LogIn className="w-5 h-5" />
                                Iniciar Sesión
                            </Link>
                            <a
                                href="#contacto"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStep(1);
                                }}
                                className="px-6 py-3 border border-white/20 text-white hover:bg-white/10 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Contactar por WhatsApp
                            </a>
                        </div>
                    </motion.div>
                )}

                {/* Formulario de contacto por WhatsApp (para no registrados) */}
                {!isAlumno && (
                    <>
                        <div className="text-center mb-6">
                            <p className="text-gray-500 text-sm">— o completá el formulario para contactarnos —</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex justify-between mb-12 relative">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors",
                                    step >= i ? "bg-primary text-white" : "bg-black/50 border border-white/10 text-gray-500"
                                )}>
                                    {step > i ? <Check className="w-5 h-5" /> : i}
                                </div>
                            ))}
                        </div>

                        <div className="glass p-8 rounded-2xl border border-white/10">
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold">¿Qué estás buscando?</h2>
                                    <div className="grid gap-4">
                                        {services.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => setFormData({ ...formData, service: s.id })}
                                                className={cn(
                                                    "p-4 rounded-xl text-left transition-all border",
                                                    formData.service === s.id
                                                        ? "bg-primary/20 border-primary text-white"
                                                        : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                                                )}
                                            >
                                                {s.name}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button
                                            onClick={handleNext}
                                            disabled={!formData.service}
                                            className="px-6 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            Siguiente <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold">Seleccioná la materia</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {subjects.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => setFormData({ ...formData, subject: s.id })}
                                                className={cn(
                                                    "p-4 rounded-xl text-center transition-all border",
                                                    formData.subject === s.id
                                                        ? "bg-primary/20 border-primary text-white"
                                                        : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                                                )}
                                            >
                                                {s.name}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <button onClick={handleBack} className="text-gray-400 hover:text-white">Atrás</button>
                                        <button
                                            onClick={handleNext}
                                            disabled={!formData.subject}
                                            className="px-6 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            Siguiente <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold">Tus datos</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Nombre Completo</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                                    placeholder="Tu nombre"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Mensaje (Opcional)</label>
                                            <textarea
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors h-32 resize-none"
                                                placeholder="¿Alguna duda específica?"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <button onClick={handleBack} className="text-gray-400 hover:text-white">Atrás</button>
                                        <a
                                            href={generateWhatsAppLink()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cn(
                                                "px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium flex items-center gap-2 transition-colors",
                                                !formData.name && "opacity-50 pointer-events-none"
                                            )}
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            Confirmar por WhatsApp
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
