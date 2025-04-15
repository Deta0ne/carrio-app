'use client';

import { motion } from 'framer-motion';

export default function StatisticsSection() {
    return (
        <div className="relative z-10 py-24 bg-[#050a14]">
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
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="absolute -inset-px bg-gradient-to-r from-[#34e89e]/20 to-[#0f3443]/20 rounded-xl opacity-0 group-hover:opacity-100 transition duration-2000"></div>
                            <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
                                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#34e89e] to-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-white/60">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
