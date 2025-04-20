'use client';

import Link from 'next/link';
import { ArrowRight, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
    return (
        <div className="relative z-10 py-24 bg-[#050a14] overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#34e89e]/50 to-transparent"></div>

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute h-[500px] w-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#34e89e]/20 rounded-full blur-[120px] animate-[pulse_30s_ease-in-out_infinite]"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative" id="cta-section">
                <motion.div
                    className="bg-gradient-to-r from-[#080c1a]/50 to-[#0a1022]/50 backdrop-blur-md rounded-2xl p-10 border border-white/10 relative transform transition-all duration-3000 hover:scale-[1.02]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="absolute -inset-px bg-gradient-to-r from-[#34e89e]/20 via-[#0f3443]/20 to-[#34e89e]/20 rounded-2xl opacity-70"></div>

                    <div className="relative text-center">
                        <motion.div
                            className="inline-flex items-center mb-6 px-4 py-1 rounded-full border border-[#34e89e]/20 bg-[#34e89e]/5 text-[#34e89e] text-sm"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <BrainCircuit className="w-4 h-4 mr-2" />
                            <span>Smart Career Management</span>
                        </motion.div>

                        <motion.h2
                            className="text-3xl md:text-4xl font-bold mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Ready to Transform Your <br />
                            Job Application Strategy?
                        </motion.h2>

                        <motion.p
                            className="text-white/70 mb-10 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            Join thousands of job seekers who have streamlined their application process with Carrio's
                            smart tracking system.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Link href="/register" className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#34e89e] to-[#0f3443] rounded-full opacity-70 blur-md group-hover:opacity-100 transition duration-2000 animate-[pulse_16s_ease-in-out_infinite]"></div>
                                <button className="relative px-8 py-4 bg-[#050a14] rounded-full font-medium inline-flex items-center gap-2 group-hover:bg-[#050a14]/80 transition duration-1500">
                                    Get Started For Free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-2000" />
                                </button>
                            </Link>

                            <Link
                                href="#"
                                className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition duration-1500 backdrop-blur-sm"
                            >
                                Learn More
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
