'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Sparkles, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <div className="relative z-10 pt-20 pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative">
                {/* Sparkle effects */}
                <motion.div
                    className="absolute -top-10 right-1/4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Sparkles className="w-6 h-6 text-[#34e89e] animate-pulse duration-[14000ms]" />
                </motion.div>
                <motion.div
                    className="absolute top-40 left-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Sparkles
                        className="w-4 h-4 text-[#34e89e] animate-pulse duration-[18000ms] delay-3000"
                        style={{ animationDelay: '1s' }}
                    />
                </motion.div>

                <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                        className="mb-8 inline-flex items-center px-3 py-1 rounded-full border border-[#34e89e]/30 bg-[#34e89e]/5 text-[#34e89e] text-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Zap className="w-4 h-4 mr-2 animate-pulse duration-[8000ms]" />
                        <span>Revolutionizing Job Applications</span>
                    </motion.div>

                    <motion.h1
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#34e89e] to-white animate-pulse duration-[16000ms]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Track Your Career Journey with Precision
                    </motion.h1>

                    <motion.p
                        className="text-xl text-white/70 mb-10 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Organize, visualize, and optimize your job search process. Save time and effort.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Link href="/register" className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#34e89e] to-[#0f3443] rounded-full opacity-70 blur-md group-hover:opacity-100 transition duration-2000 animate-pulse duration-[12000ms]"></div>
                            <button className="relative px-8 py-4 bg-[#050a14] rounded-full font-medium inline-flex items-center gap-2 group-hover:bg-[#050a14]/80 transition duration-1500">
                                Get Started
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-2000" />
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* 3D Mockup with reflection and glow */}
                <motion.div
                    className="mt-24 relative max-w-5xl mx-auto transition-all duration-2000 hover:scale-105"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#34e89e]/10 via-[#0f3443]/10 to-[#34e89e]/10 rounded-xl blur-xl opacity-70 animate-pulse duration-[20000ms]"></div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#34e89e]/20 to-[#0f3443]/20 rounded-xl"></div>

                    <div className="relative bg-[#0a0e18] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        {/* Browser Controls */}
                        <div className="bg-[#050a14] px-4 py-3 border-b border-white/10 flex items-center">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="ml-4 flex-1 bg-[#0a0e18] rounded-md px-4 py-1 text-xs text-white/50 flex items-center">
                                <div className="w-4 h-4 rounded-full bg-[#34e89e]/20 mr-2 flex items-center justify-center">
                                    <span className="text-[10px] text-[#34e89e]">C</span>
                                </div>
                                carrio.app/dashboard
                            </div>
                        </div>

                        {/* Dashboard Preview */}
                        <div className="aspect-video bg-[#0a0e18] relative overflow-hidden">
                            {/* Calendar View Mockup */}
                            <div className="absolute inset-0 flex">
                                <div className="w-[20%] border-r border-white/10 p-5">
                                    <div className="space-y-4">
                                        <div className="h-8 w-3/4 bg-white/5 rounded-md"></div>
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-[#34e89e]/10 flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-[#34e89e]" />
                                                </div>
                                                <div className="h-4 bg-white/5 rounded w-2/3"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 p-5">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="h-8 w-1/4 bg-white/5 rounded-md"></div>
                                        <div className="h-10 w-32 bg-[#34e89e]/20 rounded-md flex items-center justify-center">
                                            <div className="w-5 h-5 rounded-full bg-[#34e89e]/30 flex items-center justify-center">
                                                <span className="text-[10px] text-[#34e89e]">+</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-2">
                                        {[...Array(7)].map((_, i) => (
                                            <div key={i} className="text-center text-xs text-white/50 mb-2">
                                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                                            </div>
                                        ))}

                                        {[...Array(35)].map((_, i) => {
                                            const hasEvent = [3, 8, 12, 17, 22, 27].includes(i);
                                            const isToday = i === 15;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`aspect-square rounded-md flex items-center justify-center text-xs ${
                                                        isToday
                                                            ? 'bg-[#34e89e]/30 text-white'
                                                            : hasEvent
                                                            ? 'bg-white/5 text-white/80'
                                                            : 'text-white/40'
                                                    } ${hasEvent ? 'relative' : ''}`}
                                                >
                                                    {i + 1}
                                                    {hasEvent && (
                                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-[#34e89e]"></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Event Card */}
                                    <div className="absolute bottom-5 right-5 w-40 sm:w-56 md:w-64 bg-[#0d1320] rounded-lg p-2 sm:p-3 md:p-4 border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-2000">
                                        <div className="flex justify-between items-start mb-1 sm:mb-2 md:mb-3">
                                            <div>
                                                <div className="text-[10px] sm:text-xs md:text-sm font-medium">
                                                    Technical Interview
                                                </div>
                                                <div className="text-[8px] sm:text-[10px] md:text-xs text-white/50">
                                                    Google
                                                </div>
                                            </div>
                                            <div className="px-1 py-0.5 sm:px-1.5 sm:py-0.5 md:px-2 md:py-1 bg-blue-500/20 rounded-md text-blue-400 text-[8px] sm:text-[10px] md:text-xs">
                                                Interview
                                            </div>
                                        </div>
                                        <div className="flex items-center text-[8px] sm:text-[10px] md:text-xs text-white/60 mb-1 sm:mb-1 md:mb-2">
                                            <Calendar className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 mr-1 sm:mr-1.5 md:mr-2" />
                                            May 15, 2023 • 10:00 AM
                                        </div>
                                        <div className="flex items-center text-[8px] sm:text-[10px] md:text-xs text-white/60">
                                            <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 mr-1 sm:mr-1.5 md:mr-2" />
                                            45 minutes
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reflection effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050a14] opacity-40"></div>
                        </div>
                    </div>

                    {/* Glow beneath */}
                    <div className="absolute -bottom-10 inset-x-0 h-20 bg-[#34e89e]/10 blur-3xl rounded-full"></div>
                </motion.div>
            </div>
        </div>
    );
}
