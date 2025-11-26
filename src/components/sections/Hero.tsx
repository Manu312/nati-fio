"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium text-gray-200">Clases Particulares Premium</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                            Excelencia Académica <br />
                            <span className="text-primary">Sin Límites.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Transformamos el estudio en una experiencia de alto rendimiento.
                            Preparación exclusiva para secundaria, universidad y olimpíadas.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link
                                href="/reservar"
                                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_-5px_rgba(109,40,217,0.5)] hover:shadow-[0_0_30px_-5px_rgba(109,40,217,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Reservar Clase
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="#services"
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all backdrop-blur-sm flex items-center justify-center"
                            >
                                Ver Servicios
                            </Link>
                        </div>

                        <div className="pt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span>Profesores Expertos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span>Clases Personalizadas</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                            {/* Abstract Glass Cards Composition */}
                            <div className="absolute top-10 right-10 w-3/4 h-3/4 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl z-10 p-8 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Star className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                                    <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Progreso</span>
                                        <span className="text-primary font-bold">98%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-[98%] bg-gradient-to-r from-primary to-secondary rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-20 left-0 p-6 bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl z-20 shadow-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                                        A+
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Resultado Garantizado</p>
                                        <p className="text-xs text-gray-400">Metodología probada</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-0 right-0 p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl z-0"
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 blur-xl" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
