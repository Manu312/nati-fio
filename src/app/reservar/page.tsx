"use client";

import { motion } from "framer-motion";
import { Calendar, MessageCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { UserRole } from "@/types";

const WHATSAPP_URL = "https://wa.me/5491178268810?text=Hola%20Naty%20%26%20Fio!%20%F0%9F%91%8B%20Quiero%20reservar%20una%20clase.";

export default function BookingPage() {
    const { isAuthenticated, user } = useAuth();

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
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-6 glass rounded-2xl border border-primary/30"
                        >
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-semibold text-white mb-2">¿Sos alumno registrado?</h3>
                                <p className="text-gray-400 text-sm">Inicia sesión para reservar clases directamente con nuestros profesores</p>
                            </div>
                            <div className="flex justify-center">
                                <Link
                                    href="/login"
                                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Iniciar Sesión
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 glass rounded-2xl border border-green-500/30 bg-green-500/5 text-center"
                        >
                            <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-7 h-7 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">¿Todavía no tenés cuenta?</h3>
                            <p className="text-gray-400 text-sm mb-6">Contactanos directamente por WhatsApp y coordinamos tu primera clase</p>
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Contactar por WhatsApp
                            </a>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
