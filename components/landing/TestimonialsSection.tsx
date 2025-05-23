'use client';

import { Sparkles } from 'lucide-react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export default function TestimonialsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(500);
    const mouseY = useMotionValue(500);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
        mouseX.set(500);
        mouseY.set(500);
    };

    const background = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(52, 232, 158, 0.18), rgba(15, 52, 67, 0.1), transparent 70%)`;

    return (
        <div className="relative z-10 py-32 bg-[#06091a]" id="users">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#34e89e]/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full border border-purple-400/20 bg-purple-400/5 text-purple-400 text-sm">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span>Success Stories</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        What Our Users Say
                    </h2>
                </motion.div>

                <motion.div
                    ref={containerRef}
                    className="relative grid grid-cols-1 md:grid-cols-3 gap-10"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <motion.div
                        className="absolute inset-0 opacity-100 transition-opacity duration-200"
                        style={{
                            background,
                            filter: 'blur(40px)',
                            pointerEvents: 'none',
                        }}
                    />
                    {[
                        {
                            name: 'Sarah Johnson',
                            title: 'Software Engineer',
                            testimonial:
                                'Carrio completely transformed my job search. I was able to land my dream job because I never missed an interview and always had the right documents ready.',
                            image: '/Person3.jpeg',
                        },
                        {
                            name: 'Michael Chen',
                            title: 'UX Designer',
                            testimonial:
                                'The analytics dashboard helped me understand which applications were most successful. I optimized my resume based on the data and got 3 interviews in one week!',
                            image: '/Person2.jpeg',
                        },
                        {
                            name: 'Alice Snow',
                            title: 'Marketing Specialist',
                            testimonial:
                                'As someone who applied to dozens of positions, Carrio kept everything organized when I was feeling overwhelmed. Carrio is a lifesaver!',
                            image: '/Person.jpeg',
                        },
                    ].map((person, index) => (
                        <TestimonialCard key={index} person={person} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

function TestimonialCard({ person }: { person: { name: string; title: string; testimonial: string; image: string } }) {
    return (
        <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10">
            <div className="flex items-start mb-6">
                <div className="mr-4">
                    <div className="w-10 h-10 rounded-full">
                        <Avatar>
                            <AvatarFallback className="rounded-full">CN</AvatarFallback>
                            <AvatarImage src={person.image} alt={person.name} className="rounded-full" />
                        </Avatar>
                    </div>
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
    );
}
