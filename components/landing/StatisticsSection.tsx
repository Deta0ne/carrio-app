'use client';

import { motion, useMotionValue, useSpring, useInView, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const parseNumericValue = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
};

export default function StatisticsSection() {
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        setHasAnimated(false);
    }, []);

    return (
        <div className="relative z-10 py-24 bg-[#050a14]">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#34e89e]/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {[
                        { value: '93%', label: 'Success Rate' },
                        { value: '2.5x', label: 'More Interviews' },
                        { value: '500+', label: 'Happy Users' },
                        { value: '35%', label: 'Time Saved' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="relative group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
                            whileInView={!hasAnimated ? { opacity: 1, y: 0 } : {}}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="absolute -inset-px bg-gradient-to-r from-[#34e89e]/20 to-[#0f3443]/20 rounded-xl opacity-0 group-hover:opacity-100 transition duration-2000"></div>
                            <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
                                <CountingNumber value={stat.value} delay={index * 0.2} hasAnimated={hasAnimated} />
                                <div className="text-white/60">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CountingNumber({ value, delay, hasAnimated }: { value: string; delay: number; hasAnimated: boolean }) {
    const ref = useRef(null);
    const inView = useInView(ref);
    const numericValue = parseNumericValue(value);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        duration: 5000,
        bounce: 0.08,
    });

    const roundedValue = useTransform(springValue, (latest) => latest.toFixed(value.includes('x') ? 1 : 0));

    useEffect(() => {
        if (inView && !hasAnimated) {
            motionValue.set(numericValue);
        }
    }, [inView, motionValue, numericValue, hasAnimated]);

    return (
        <motion.div
            ref={ref}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#34e89e] to-white mb-2"
        >
            <motion.span>{hasAnimated ? value : roundedValue}</motion.span>
            {!hasAnimated && <span>{value.includes('%') ? '%' : value.includes('x') ? 'x' : '+'}</span>}
        </motion.div>
    );
}
