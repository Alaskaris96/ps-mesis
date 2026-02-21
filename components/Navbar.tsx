'use client'; // Ensure client-side rendering for state

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import * as motion from 'framer-motion/client'; // Keep using the client proxy if that's how it is set up, or switch to standard import if problematic. Assuming it works.
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Navbar({ user }: { user: any }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { href: "/", label: "Αρχική" },
        { href: "/news", label: "Νέα" },
        { href: "/history", label: "Ιστορία" },
        { href: "/family-tree", label: "Γενεαλογικό Δέντρο" },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container flex h-20 items-center justify-between mx-auto px-4">
                <Link href="/" className="flex items-center space-x-2">
                    {/* Placeholder for Logo - User to replace with actual path */}
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[var(--primary)] text-primary">
                        <Image
                            src="/assets/logo.jpg"
                            alt="Logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className="hidden font-bold sm:inline-block text-[var(--primary)] text-lg">
                        Πολιτιστικός Σύλλογος Μέσης
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="transition-colors hover:text-[var(--primary)] text-nowrap"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium ml-4">
                            <LogOut className="h-4 w-4" />
                            Αποσύνδεση
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={toggleMenu}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <div className="flex flex-col space-y-4 p-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium transition-colors hover:text-[var(--primary)]"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user && (
                            <Button variant="ghost" className="justify-start px-0 text-red-600 hover:text-red-700 hover:bg-transparent" onClick={() => { setIsMenuOpen(false); handleLogout(); }}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Αποσύνδεση
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </motion.nav>
    );
}
