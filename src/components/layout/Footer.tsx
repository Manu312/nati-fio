import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold font-heading">Naty & Fio</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Elevando el estándar de la educación particular. Preparación de alto rendimiento para estudiantes que buscan la excelencia.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Plataforma</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-primary transition-colors">Inicio</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Nuestros Profesores</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Metodología</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Recursos</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Contacto</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>contacto@natyfio.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>+54 11 1234-5678</span>
                            </li>
                            <li className="flex gap-4 mt-4">
                                <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Naty & Fio. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
