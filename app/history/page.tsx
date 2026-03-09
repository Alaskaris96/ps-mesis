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
        year: '6500 - 5600 π.Χ.',
        era: 'Προϊστορικοί Χρόνοι',
        title: 'Νεολιθικοί Οικισμοί',
        description: 'Η συνεχής και εντατική χρήση του χώρου από την αρχαιότερη νεολιθική περίοδο αποδεικνύεται από επιφανειακά ευρήματα. Μικροί παρόχθιοι οικισμοί υπήρχαν κατά μήκος του κάτω ρου του Αλιάκμονα.',
        image: '/neolithic_mesi.png',
    },
    {
        year: '11ος - 8ος αι. π.Χ.',
        era: 'Προϊστορικοί Χρόνοι',
        title: 'Πρώιμη Εποχή του Σιδήρου',
        description: 'Στη δυτική είσοδο του χωριού βρέθηκαν δείγματα χειροποίητης και τροχήλατης κεραμικής από πιθοειδή και άλλα αγγεία, μαρτυρώντας την κατοίκηση της περιοχής κατά τους αρχαίους χρόνους.',
        image: 'https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?q=80&w=1000&auto=format&fit=crop',
    },
    {
        year: '1898',
        era: 'Τουρκοκρατία',
        title: 'Το Μέτσι της Ημαθίας',
        description: 'Σύμφωνα με αναφορές του μητροπολίτη Βεροίας Κωνστάντιου Ισαακίδη, στον οικισμό (τότε γνωστό ως Μέτσι) διέμεναν 27 χριστιανικές οικογένειες.',
        image: '/macedonian_history.png',
    },
    {
        year: '1904 - 1908',
        era: 'Μακεδονικός Αγώνας',
        title: 'Η Συνεισφορά στον Αγώνα',
        description: 'Οι κάτοικοι της Μέσης συνεισέφεραν σημαντικά στον Μακεδονικό Αγώνα. Σημαντικοί σύνδεσμοι ήταν οι Αθανάσιος Αργυρίου, Δημήτριος Ιωάννου και Δημήτριος Μπαλτζής.',
        image: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?q=80&w=1000&auto=format&fit=crop',
    },
    {
        year: '1918 - 1926',
        era: 'Σύγχρονη Ελλάδα',
        title: 'Επίσημη Ονομασία',
        description: 'Μετά τους Βαλκανικούς Πολέμους, ο οικισμός προσαρτάται στον δήμο Βεροίας. Το 1926, το όνομα από "Μέτσι" διορθώνεται επίσημα σε "Μέση".',
        image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000&auto=format&fit=crop',
    },
    {
        year: 'Σήμερα',
        era: 'Σύγχρονη Ελλάδα',
        title: 'Η Μέση στο 21ο Αιώνα',
        description: 'Σύμφωνα με την απογραφή του 2011, η Μέση έχει 568 κατοίκους. Αποτελεί μέρος της κοινότητας Βέροιας, διατηρώντας την ιστορική της ταυτότητα δίπλα στον Αλιάκμονα.',
        image: '/modern_mesi.png',
    },
];

const eras = [
    { name: 'Προϊστορικοί Χρόνοι', years: '6500 π.Χ. – 8ος αι. π.Χ.', start: 0, end: 0.33 },
    { name: 'Τουρκοκρατία & Αγώνας', years: '1898–1908', start: 0.33, end: 0.66 },
    { name: 'Σύγχρονη Ελλάδα', years: '1918–Σήμερα', start: 0.66, end: 1 },
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
                        Ιστορία της Μέσης
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/80 max-w-2xl mx-auto"
                    >
                        Από τους προϊστορικούς οικισμούς του Αλιάκμονα μέχρι το σημερινό οικισμό της Ημαθίας, ανακαλύψτε το χρονικό της Μέσης.
                    </motion.p>
                </div>
            </section>

            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl font-serif">Γεωγραφική Θέση</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Η Μέση είναι οικισμός της Κεντρικής Μακεδονίας στην Περιφερειακή Ενότητα Ημαθίας.
                            Βρίσκεται στα βόρεια του ποταμού <strong>Αλιάκμονα</strong>, σε υψόμετρο 30 μέτρα.
                            Απέχει περίπου <strong>6 χλμ. Ανατολικά από τη Βέροια</strong> και 65 χλμ. Δυτικά-Νοτιοδυτικά από τη Θεσσαλονίκη.
                        </p>
                    </div>
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
