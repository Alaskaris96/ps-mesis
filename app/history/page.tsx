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
        year: 'Τουρκοκρατία & 1904-1908',
        era: 'Αγώνας για Ελευθερία',
        title: 'Κρησφύγετο και Αυτοθυσία',
        description: 'Κατά την Τουρκοκρατία, η Μέση Άμμος ήταν καταφύγιο για τα ελληνικά σώματα λόγω της θέσης της κοντά στο "Βάλτο" των Γιαννιτσών. Οι κάτοικοι, αψηφώντας τα αντίποινα, τροφοδοτούσαν τους αντάρτες και λειτουργούσαν ως σύνδεσμοι, κρατώντας ζωντανή την ελληνική συνείδηση.',
        image: '/macedonian_history.png',
    },
    {
        year: 'Μέσα 20ού Αιώνα',
        era: 'Η Μετακίνηση',
        title: 'Η Μάχη με τον Αλιάκμονα',
        description: 'Ο απρόβλεπτος Αλιάκμονας προκαλούσε συχνά καταστροφικές πλημμύρες στην παλιά τοποθεσία. Μετά από μια σφοδρή πλημμύρα, οι κάτοικοι πήραν τη γενναία απόφαση να μεταφέρουν ολόκληρο το χωριό στη σημερινή ασφαλή θέση, χτίζοντας τα πάντα από την αρχή με απίστευτη εργατικότητα.',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop',
    },
    {
        year: 'Σύγχρονη Εποχή',
        era: 'Αγροτική Αριστεία',
        title: 'Ο «Κήπος» της Ημαθίας',
        description: 'Η εργατικότητα των προγόνων μεταμορφώθηκε σε σύγχρονη τεχνογνωσία. Σήμερα, η Μέση είναι βασικός παραγωγικός πνεύμονας για ροδάκινα και ακτινίδια, με τα προϊόντα της να εξάγονται σε όλη την Ευρώπη μέσω ισχυρής συνεταιριστικής πρότασης.',
        image: '/modern_mesi.png',
    },
    {
        year: 'Σήμερα',
        era: 'Τουριστική Ανάπτυξη',
        title: 'Οι Ανθισμένες Ροδακινιές',
        description: 'Κάθε Μάρτιο, ο κάμπος μεταμορφώνεται σε μια απέραντη ροζ θάλασσα, προσελκύοντας χιλιάδες επισκέπτες. Η Μέση αναδεικνύεται σε κέντρο τουρισμού, συνδυάζοντας το "Ιαπωνικό" τοπίο των ανθισμένων δέντρων με τη ζεστή τοπική φιλοξενία.',
        image: 'https://images.unsplash.com/photo-1521483756775-c37af386fce9?q=80&w=2000&auto=format&fit=crop',
    },
];

const eras = [
    { name: 'Αγώνας για Ελευθερία', years: 'Πριν το 1912', start: 0, end: 0.25 },
    { name: 'Η Μετακίνηση', years: '1940 - 1960', start: 0.25, end: 0.5 },
    { name: 'Αγροτική Αριστεία', years: '1970 - 2010', start: 0.5, end: 0.75 },
    { name: 'Τουρισμός & Μέλλον', years: 'Σήμερα', start: 0.75, end: 1 },
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
                <div className="absolute inset-0 bg-black/50 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1521483756775-c37af386fce9?q=80&w=2000&auto=format&fit=crop"
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
                        className="text-xl text-white/90 max-w-2xl mx-auto font-light"
                    >
                        Ένας τόπος που σμιλεύτηκε από τον ηρωισμό, τις λάσπες του Αλιάκμονα και την ακούραστη εργατικότητα των ανθρώπων του.
                    </motion.p>
                </div>
            </section>

            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-4xl font-serif">Ένα Χρονικό Αντοχής</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed italic">
                            &quot;Η Μέση Ημαθίας είναι το ζωντανό παράδειγμα ότι η μοίρα ενός τόπου δεν ορίζεται από τις καταστροφές, αλλά από την απόφαση των ανθρώπων του να μην τα παρατήσουν ποτέ.&quot;
                        </p>
                        <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
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

                {/* Era Progress Indicator */}
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

            {/* Note Section */}
            <section className="mt-32 py-20 bg-primary/5 border-y border-primary/10">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-serif">Η Σύγχρονη Ταυτότητα</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Σήμερα, η Μέση παραμένει ένα ζωντανό χωριό, με κατοίκους που διατηρούν τις παραδόσεις τους, όπως το έθιμο των <strong>Μωμόγερων</strong>, θυμίζοντας τις ρίζες και την ιστορία τους, ενώ η εκκλησία του <strong>Τιμίου Προδρόμου</strong> παραμένει το πνευματικό κέντρο της κοινότητας.
                        </p>
                    </div>
                </div>
            </section>
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
