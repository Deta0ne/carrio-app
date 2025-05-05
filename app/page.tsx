import { Metadata } from 'next';
import Link from 'next/link';

import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import StatisticsSection from '@/components/landing/StatisticsSection';

export const metadata: Metadata = {
    title: 'Carrio',
    description: 'Carrio is a job application tracker that helps you manage your job applications.',
};

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-[#030508] text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f103000_1px,transparent_1px),linear-gradient(to_bottom,#0f103000_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>

                {/* Gradient Orbs */}
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-[#34e89e]/30 blur-[120px] animate-pulse duration-&lsqb;16000ms&rsqb"></div>
                <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-[#0f3443]/40 blur-[120px] animate-pulse duration-&lsqb;20000ms&rsqb delay-2000"></div>
                <div className="absolute top-3/4 left-1/3 w-[300px] h-[300px] rounded-full bg-blue-500/20 blur-[120px] animate-pulse duration-&lsqb;24000ms&rsqb delay-4000"></div>

                {/* Animated lines/particles */}
                <div className="absolute inset-0 overflow-hidden opacity-40">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#34e89e]/60 to-transparent animate-pulse opacity-70 duration-&lsqb;10000ms&rsqb"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: 0,
                                width: '100%',
                                animationDelay: `${i * 1}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Navbar with frosted glass effect */}
            <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#030508]/90 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#34e89e] to-[#0f3443] flex items-center justify-center">
                            <span className="text-lg font-bold">C</span>
                        </div>
                        <span className="font-bold text-xl">Carrio</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        {[
                            { name: 'Features', href: '#features' },
                            { name: 'Pricing', href: '#cta-section' },
                            { name: 'Users', href: '#users' },
                            { name: 'Contact', href: '/support' },
                        ].map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="text-sm text-white/70 hover:text-white transition-colors duration-1500 relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#34e89e] group-hover:w-full transition-all duration-2000"></span>
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/login"
                            className="text-sm text-white/70 hover:text-white transition-colors duration-1500"
                        >
                            Login
                        </Link>
                        <Link href="/register" className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#34e89e] to-[#0f3443] rounded-full blur-sm opacity-70 group-hover:opacity-100 transition duration-2000"></div>
                            <button className="relative px-5 py-2 bg-[#050a14] rounded-full text-sm font-medium">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* Statistics Section */}
            <StatisticsSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* CTA Section */}
            <CTASection />

            {/* Footer */}
            <footer className="relative z-10 bg-[#030509] py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                        <div>
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#34e89e] to-[#0f3443] flex items-center justify-center">
                                    <span className="text-sm font-bold">C</span>
                                </div>
                                <span className="font-bold text-lg">Carrio</span>
                            </div>
                            <p className="text-sm text-white/50 max-w-xs">
                                The smart way to manage your job applications and advance your career.
                            </p>
                        </div>

                        <div className="flex justify-between w-full ">
                            {[
                                {
                                    title: 'Product',
                                    links: ['Features', 'Pricing', 'Demo', 'Roadmap'],
                                },
                                {
                                    title: 'Company',
                                    links: ['About', 'Blog', 'Careers', 'Contact'],
                                },
                                {
                                    title: 'Resources',
                                    links: ['Support', 'Documentation', 'Privacy', 'Terms'],
                                },
                            ].map((column, index) => (
                                <div key={index} className="space-y-4 w-full">
                                    <h3 className="font-medium mb-4 text-white/80">{column.title}</h3>
                                    <ul className="space-y-2">
                                        {column.links.map((link, i) => (
                                            <li key={i}>
                                                <Link
                                                    href={`/${link.toLowerCase()}`}
                                                    className="text-sm text-white/50 hover:text-white transition-colors duration-1500 pointer-events-none opacity-50"
                                                    aria-disabled="true"
                                                >
                                                    {link}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-white/40">
                            &copy; {new Date().getFullYear()} Carrio. All rights reserved.
                        </div>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            {[
                                { name: 'LinkedIn', href: 'https://www.linkedin.com/in/mert-yıldız-60b519227' },
                                { name: 'GitHub', href: 'https://github.com/Deta0ne/carrio-app' },
                                {
                                    name: 'Instagram',
                                    href: 'https://www.instagram.com/merty.s?utm_source=qr&igsh=emVnNGg5MTFvbzJl',
                                },
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="text-sm text-white/40 hover:text-white transition-colors duration-1500"
                                >
                                    {social.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
