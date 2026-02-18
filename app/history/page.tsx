'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    image?: string;
    era: string;
}

const timelineData: TimelineEvent[] = [
    {
        year: '1821',
        era: 'Εποχή της Επανάστασης',
        title: 'Αγώνας κατά των Τούρκων',
        description: 'Οι κάτοικοι της Μέσης συμμετείχαν ενεργά στην Ελληνική Επανάσταση, προσφέροντας εφόδια και αγωνιστές στον ιερό αγώνα για την ελευθερία.',
        image: 'https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?q=80&w=1000&auto=format&fit=crop',
    },
    {
        year: '1912',
        era: 'Εποχή των Πολέμων',
        title: 'Βαλκανικοί Πόλεμοι',
        description: 'Η επιστροφή των ηρώων από το μέτωπο και η ενσωμάτωση της περιοχής στον εθνικό κορμό έφερε νέο αέρα ανάπτυξης στο χωριό.',
        image: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?q=80&w=1000&auto=format&fit=crop',
    },
    {
        year: '1940',
        era: 'Εποχή των Πολέμων',
        title: 'Β\' Παγκόσμιος Πόλεμος',
        description: 'Η Μέση αντιστάθηκε σθεναρά στις δυνάμεις κατοχής. Πολλοί συγχωριανοί μας πολέμησαν στα βουνά για την προάσπιση της πατρίδας.',
        image: 'https://images.unsplash.com/photo-1505348825835-9610f63b8b15?q=80&w=1000&auto=format&fit=crop',
    },
    {
        year: '1967',
        era: 'Σύγχρονη Εποχή',
        title: 'Περίοδος της Δικτατορίας',
        description: 'Τα δύσκολα χρόνια της Χούντας δοκίμασαν τις αντοχές της κοινότητας. Η αποκατάσταση της Δημοκρατίας το 1974 γιορτάστηκε με μεγαλοπρέπεια.',
        image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000&auto=format&fit=crop',
    },
    {
        year: '1980',
        era: 'Σύγχρονη Εποχή',
        title: 'Ίδρυση Πολιτιστικού Συλλόγου',
        description: 'Ο Πολιτιστικός Σύλλογος Μέσης ιδρύθηκε επίσημα με σκοπό τη διατήρηση των τοπικών παραδόσεων και της κληρονομιάς μας.',
        image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop',
    },
    {
        year: '2025',
        era: 'Σύγχρονη Εποχή',
        title: 'Το Μέλλον της Μέσης',
        description: 'Σήμερα, η Μέση κοιτάζει το μέλλον με αισιοδοξία, συνδυάζοντας την πλούσια ιστορία της με τις σύγχρονες ανάγκες της κοινωνίας.',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop',
    },
];

const eras = [
    { name: 'Εποχή της Επανάστασης', years: '1821–1900', start: 0, end: 0.33 },
    { name: 'Εποχή των Πολέμων', years: '1900–1950', start: 0.33, end: 0.66 },
    { name: 'Σύγχρονη Εποχή', years: '1950–Σήμερα', start: 0.66, end: 1 },
];

export default function HistoryPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="bg-background text-foreground min-h-screen pb-20 overflow-hidden" ref={containerRef}>
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
                    alt="Ιστορία της Μέσης"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif text-white mb-4"
                    >
                        Το Ταξίδι μας στο Χρόνο
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/80 max-w-2xl mx-auto"
                    >
                        Ανακαλύψτε την πλούσια κληρονομιά και τους σταθμούς της Μέσης, από την επανάσταση μέχρι σήμερα.
                    </motion.p>
                </div>
            </section>

            <div className="container mx-auto px-4 relative mt-20">
                {/* Central Vertical Bar */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2 hidden md:block" />
                <motion.div
                    className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary -translate-x-1/2 origin-top hidden md:block"
                    style={{ scaleY }}
                />

                {/* Era Progress Indicator (Fixed-like behavior) */}
                <div className="fixed right-10 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-8 border-l border-primary/20 pl-6">
                    {eras.map((era) => (
                        <EraIndicator key={era.name} era={era} scrollYProgress={scrollYProgress} />
                    ))}
                </div>

                {/* Timeline Entries */}
                <div className="space-y-24 md:space-y-32 relative">
                    {timelineData.map((event, index) => (
                        <TimelineItem key={index} event={event} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function EraIndicator({ era, scrollYProgress }: { era: any, scrollYProgress: any }) {
    const opacity = useTransform(
        scrollYProgress,
        [era.start, era.start + 0.05, era.end - 0.05, era.end],
        [0.3, 1, 1, 0.3]
    );

    const scale = useTransform(
        scrollYProgress,
        [era.start, era.start + 0.05, era.end - 0.05, era.end],
        [0.9, 1.1, 1.1, 0.9]
    );

    const color = useTransform(
        scrollYProgress,
        [era.start, era.start + 0.05, era.end - 0.05, era.end],
        ['#888', '#B8860B', '#B8860B', '#888']
    );

    return (
        <motion.div style={{ opacity, scale }} className="flex flex-col gap-1">
            <motion.span style={{ color }} className="text-xs font-bold uppercase tracking-widest">{era.years}</motion.span>
            <span className="text-sm font-serif font-semibold">{era.name}</span>
        </motion.div>
    );
}

function TimelineItem({ event, index }: { event: TimelineEvent, index: number }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
        >
            {/* Content */}
            <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                <div className="inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-full mb-4">
                    {event.year}
                </div>
                <h3 className="text-3xl font-serif mb-4">{event.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg max-w-xl ml-auto mr-0 md:mr-auto">
                    {event.description}
                </p>
            </div>

            {/* Center Dot */}
            <div className="relative flex items-center justify-center z-20">
                <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg" />
            </div>

            {/* Image */}
            <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16'}`}>
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group">
                    <Image
                        src={event.image || '/placeholder.svg'}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                </div>
            </div>
        </motion.div>
    );
}
