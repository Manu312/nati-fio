"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, BookOpen, User, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";

const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/#services" },
    { name: "Nosotros", href: "/nosotros" },
];

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        if (user.roles.includes(UserRole.ADMIN)) return '/admin';
        if (user.roles.includes(UserRole.ALUMNO)) return '/alumno';
        if (user.roles.includes(UserRole.PROFESOR)) return '/profesor';
        return '/';
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled ? "glass bg-background/60 py-3" : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold font-heading tracking-tight">
                        Naty & Fio
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* CTA & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
                            >
                                <User className="w-4 h-4" />
                                <span className="text-sm font-medium">{user?.email}</span>
                            </button>
                            
                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                                    >
                                        <Link
                                            href={getDashboardLink()}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span>Mi Panel</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setShowUserMenu(false);
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Cerrar Sesión</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/reservar"
                                className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-all shadow-[0_0_20px_-5px_rgba(109,40,217,0.5)] hover:shadow-[0_0_25px_-5px_rgba(109,40,217,0.6)] hover:-translate-y-0.5"
                            >
                                Reservar Clase
                            </Link>
                        </>
                    )}

                    <button
                        className="md:hidden p-2 text-gray-300 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-white/10 overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-base font-medium text-gray-300 hover:text-white py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href={getDashboardLink()}
                                        className="mt-2 flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-primary rounded-lg"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Mi Panel
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-red-600 bg-red-50 rounded-lg"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center px-6 py-3 text-base font-medium text-gray-300 hover:text-white border border-gray-600 rounded-lg"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href="/reservar"
                                        className="flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Reservar Clase
                                    </Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
