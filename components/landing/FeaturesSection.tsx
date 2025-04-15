'use client';

import { Calendar, LineChart, NotebookPen, Radar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturesSection() {
    return (
        <div className="relative z-10 py-32 bg-[#06091a]" id="features">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#34e89e]/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full border border-blue-600/20 bg-blue-600/5 text-blue-400 text-sm">
                        <Radar className="w-4 h-4 mr-2" />
                        <span>Powerful Features</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Supercharge Your Job Search
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            icon: <Calendar className="w-10 h-10 text-[#34e89e]" />,
                            title: 'Smart Calendar',
                            description:
                                'Never miss an interview or deadline with our intelligent scheduling system and automatic reminders.',
                            color: '#34e89e',
                            delay: 0.2,
                        },
                        {
                            icon: <LineChart className="w-10 h-10 text-[#4d7cfe]" />,
                            title: 'Analytics Dashboard',
                            description:
                                'Gain insights into your application process with detailed metrics and performance analytics.',
                            color: '#4d7cfe',
                            delay: 0.4,
                        },
                        {
                            icon: <NotebookPen className="w-10 h-10 text-[#ee6ffe]" />,
                            title: 'Document Manager',
                            description:
                                'Keep all your resumes, cover letters, and notes organized in one secure place.',
                            color: '#ee6ffe',
                            delay: 0.6,
                        },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="group relative"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.5, delay: feature.delay }}
                        >
                            <div className="absolute -inset-px bg-gradient-to-b from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition duration-2000"></div>
                            <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 h-full transition-all duration-2000 group-hover:translate-y-[-5px]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 rounded-br-xl"></div>

                                <div className="mb-6 relative">
                                    <div className={`p-3 rounded-xl bg-[${feature.color}]/10 inline-block`}>
                                        {feature.icon}
                                    </div>
                                    <div
                                        className={`absolute -inset-4 bg-[${feature.color}]/10 rounded-full blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-3000`}
                                    ></div>
                                </div>

                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-white/70">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
