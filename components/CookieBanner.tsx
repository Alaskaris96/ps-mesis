'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <h3 className="text-lg font-serif font-bold mb-2">Ενημέρωση για τα Cookies</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Χρησιμοποιούμε cookies για να διασφαλίσουμε την καλύτερη δυνατή εμπειρία στον ιστότοπό μας.
                                Σημειώστε ότι δεν συλλέγουμε ούτε χρησιμοποιούμε προσωπικά δεδομένα των χρηστών μας.
                                Για οποιαδήποτε απορία, μπορείτε να επικοινωνήσετε μαζί μας στο <a href="mailto:ps-mesis@gmail.com" className="text-primary hover:underline font-medium">ps-mesis@gmail.com</a>.
                            </p>
                        </div>
                        <div className="flex shrink-0 gap-4">
                            <button
                                onClick={acceptCookies}
                                className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 whitespace-nowrap"
                            >
                                Εντάξει
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
