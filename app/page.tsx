import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import {
    Check,
    LineChart,
    Calendar,
    Clock,
    ArrowRight,
    Search,
    NotebookPen,
    ChevronDown,
    Sparkles,
    Zap,
    BrainCircuit,
    Radar,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Carrio',
    description: 'Carrio is a job application tracker that helps you manage your job applications.',
};

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-[#050a14] text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f103000_1px,transparent_1px),linear-gradient(to_bottom,#0f103000_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)]"></div>

                {/* Gradient Orbs */}
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-[#34e89e]/20 blur-[100px] animate-pulse duration-[16000ms]"></div>
                <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-[#0f3443]/30 blur-[100px] animate-pulse duration-[20000ms] delay-2000"></div>
                <div className="absolute top-3/4 left-1/3 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[100px] animate-pulse duration-[24000ms] delay-4000"></div>

                {/* Animated lines/particles */}
                <div className="absolute inset-0 overflow-hidden opacity-30">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#34e89e]/50 to-transparent animate-pulse opacity-70 duration-[10000ms]"
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
            <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#050a14]/80 border-b border-white/10">
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
                            { name: 'Contact', href: '#contact' },
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
            <div className="relative z-10 pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative">
                    {/* Sparkle effects */}
                    <div className="absolute -top-10 right-1/4">
                        <Sparkles className="w-6 h-6 text-[#34e89e] animate-pulse duration-[14000ms]" />
                    </div>
                    <div className="absolute top-40 left-20">
                        <Sparkles
                            className="w-4 h-4 text-[#34e89e] animate-pulse duration-[18000ms] delay-3000"
                            style={{ animationDelay: '1s' }}
                        />
                    </div>

                    <div className="text-center max-w-3xl mx-auto">
                        <div className="mb-8 inline-flex items-center px-3 py-1 rounded-full border border-[#34e89e]/30 bg-[#34e89e]/5 text-[#34e89e] text-sm">
                            <Zap className="w-4 h-4 mr-2 animate-pulse duration-[8000ms]" />
                            <span>Revolutionizing Job Applications</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#34e89e] to-white animate-pulse duration-[16000ms]">
                            Track Your Career Journey with Precision
                        </h1>

                        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                            Organize, visualize, and optimize your job search process. Save time and effort.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register" className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#34e89e] to-[#0f3443] rounded-full opacity-70 blur-md group-hover:opacity-100 transition duration-2000 animate-pulse duration-[12000ms]"></div>
                                <button className="relative px-8 py-4 bg-[#050a14] rounded-full font-medium inline-flex items-center gap-2 group-hover:bg-[#050a14]/80 transition duration-1500">
                                    Get Started
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-2000" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* 3D Mockup with reflection and glow */}
                    <div className="mt-24 relative max-w-5xl mx-auto transition-all duration-2000 hover:scale-105">
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
                                        <div className="absolute bottom-5 right-5 w-64 bg-[#0d1320] rounded-lg p-4 border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-2000">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="text-sm font-medium">Technical Interview</div>
                                                    <div className="text-xs text-white/50">Google</div>
                                                </div>
                                                <div className="px-2 py-1 bg-blue-500/20 rounded-md text-blue-400 text-xs">
                                                    Interview
                                                </div>
                                            </div>
                                            <div className="flex items-center text-xs text-white/60 mb-2">
                                                <Calendar className="w-3 h-3 mr-2" />
                                                May 15, 2023 • 10:00 AM
                                            </div>
                                            <div className="flex items-center text-xs text-white/60">
                                                <Clock className="w-3 h-3 mr-2" />
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
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative z-10 py-32 bg-[#06091a]" id="features">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#34e89e]/50 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full border border-blue-600/20 bg-blue-600/5 text-blue-400 text-sm">
                            <Radar className="w-4 h-4 mr-2" />
                            <span>Powerful Features</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            Supercharge Your Job Search
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Calendar className="w-10 h-10 text-[#34e89e]" />,
                                title: 'Smart Calendar',
                                description:
                                    'Never miss an interview or deadline with our intelligent scheduling system and automatic reminders.',
                                color: '#34e89e',
                            },
                            {
                                icon: <LineChart className="w-10 h-10 text-[#4d7cfe]" />,
                                title: 'Analytics Dashboard',
                                description:
                                    'Gain insights into your application process with detailed metrics and performance analytics.',
                                color: '#4d7cfe',
                            },
                            {
                                icon: <NotebookPen className="w-10 h-10 text-[#ee6ffe]" />,
                                title: 'Document Manager',
                                description:
                                    'Keep all your resumes, cover letters, and notes organized in one secure place.',
                                color: '#ee6ffe',
                            },
                        ].map((feature, index) => (
                            <div key={index} className="group relative">
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
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="relative z-10 py-24 bg-[#050a14]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {[
                            { value: '93%', label: 'Success Rate' },
                            { value: '2.5x', label: 'More Interviews' },
                            { value: '500+', label: 'Happy Users' },
                            { value: '35%', label: 'Time Saved' },
                        ].map((stat, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute -inset-px bg-gradient-to-r from-[#34e89e]/20 to-[#0f3443]/20 rounded-xl opacity-0 group-hover:opacity-100 transition duration-2000"></div>
                                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
                                    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#34e89e] to-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-white/60">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="relative z-10 py-32 bg-[#06091a]" id="users">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#34e89e]/50 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full border border-purple-400/20 bg-purple-400/5 text-purple-400 text-sm">
                            <Sparkles className="w-4 h-4 mr-2" />
                            <span>Success Stories</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            What Our Users Say
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                name: 'Sarah Johnson',
                                title: 'Software Engineer',
                                testimonial:
                                    'Carrio completely transformed my job search. I was able to land my dream job because I never missed an interview and always had the right documents ready.',
                            },
                            {
                                name: 'Michael Chen',
                                title: 'UX Designer',
                                testimonial:
                                    'The analytics dashboard helped me understand which applications were most successful. I optimized my resume based on the data and got 3 interviews in one week!',
                            },
                            {
                                name: 'Priya Patel',
                                title: 'Marketing Specialist',
                                testimonial:
                                    'As someone who applied to dozens of positions, Carrio kept everything organized when I was feeling overwhelmed. Carrio is a lifesaver!',
                            },
                        ].map((person, index) => (
                            <div
                                key={index}
                                className="group relative transform transition-all duration-3000 hover:scale-105"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#34e89e]/30 to-[#0f3443]/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-2000"></div>
                                <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10">
                                    <div className="flex items-start mb-6">
                                        <div className="mr-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#34e89e] to-[#0f3443]"></div>
                                        </div>
                                        <div>
                                            <div className="font-medium">{person.name}</div>
                                            <div className="text-sm text-white/50">{person.title}</div>
                                        </div>
                                    </div>

                                    <p className="text-white/80 mb-6">"{person.testimonial}"</p>

                                    <div className="flex text-[#34e89e]">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative z-10 py-24 bg-[#050a14] overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute h-[500px] w-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#34e89e]/20 rounded-full blur-[120px] animate-pulse duration-[30000ms]"></div>
                </div>

                <div className="max-w-4xl mx-auto px-6 relative" id="cta-section">
                    <div className="bg-gradient-to-r from-[#080c1a]/50 to-[#0a1022]/50 backdrop-blur-md rounded-2xl p-10 border border-white/10 relative transform transition-all duration-3000 hover:scale-[1.02]">
                        <div className="absolute -inset-px bg-gradient-to-r from-[#34e89e]/20 via-[#0f3443]/20 to-[#34e89e]/20 rounded-2xl opacity-70"></div>

                        <div className="relative text-center">
                            <div className="inline-flex items-center mb-6 px-4 py-1 rounded-full border border-[#34e89e]/20 bg-[#34e89e]/5 text-[#34e89e] text-sm">
                                <BrainCircuit className="w-4 h-4 mr-2" />
                                <span>Smart Career Management</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Ready to Transform Your <br />
                                Job Application Strategy?
                            </h2>

                            <p className="text-white/70 mb-10 max-w-2xl mx-auto">
                                Join thousands of job seekers who have streamlined their application process with
                                Carrio's smart tracking system.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register" className="group relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#34e89e] to-[#0f3443] rounded-full opacity-70 blur-md group-hover:opacity-100 transition duration-2000 animate-pulse duration-[16000ms]"></div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                                { name: 'X', href: '#' },
                                { name: 'LinkedIn', href: 'www.linkedin.com/in/mert-yıldız-60b519227' },
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
