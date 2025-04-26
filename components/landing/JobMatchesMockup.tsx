'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Assuming Button component exists
import { Progress } from '@/components/ui/progress'; // Assuming Progress component exists
import { MapPin, Briefcase, Clock, Info } from 'lucide-react'; // Assuming lucide-react is installed

// Simplified representation of job match data for mockup
const mockJobMatches = [
    {
        title: 'Senior Frontend Developer',
        company: 'TechGrowth Inc.',
        location: 'Istanbul, Turkey',
        type: 'Full-time',
        match: 82,
        level: 'Senior',
        posted: '1 week ago',
        skills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Next.js', 'Tailwind CSS'],
        status: 'Closed',
        statusColor: 'red',
    },
    {
        title: 'Frontend Software Engineer',
        company: 'Skyline Systems',
        location: 'Barcelona, Spain',
        type: 'Full-time',
        match: 80,
        level: 'Junior',
        posted: '3 days ago',
        skills: ['JavaScript', 'HTML', 'CSS', 'Git', 'Bootstrap', 'REST APIs'],
        status: 'Active',
        statusColor: 'green',
    },
];

// Map status colors for badges
const statusBadgeColors = {
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// Map match percentage colors for progress bar
const progressColors = {
    82: '[&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-cyan-400',
    80: '[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-green-500',
};

export function JobMatchesMockup() {
    return (
        <motion.div
            className="relative max-w-5xl mx-auto transition-all duration-2000 hover:scale-105"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }} // Adjust delay as needed
        >
            {/* Glow and Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f3443]/20 via-[#34e89e]/20 to-[#0f3443]/20 rounded-xl blur-xl opacity-80 animate-[pulse_20s_ease-in-out_infinite]"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0f3443]/30 to-[#34e89e]/30 rounded-xl"></div>

            <div className="relative bg-[#030508] border border-white/10 rounded-xl  shadow-2xl">
                {/* Browser Controls */}
                <div className="bg-[#020304] px-4 py-3 border-b border-white/10 flex items-center rounded-t-xl">
                    <div className="flex space-x-2 ">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-4 flex-1 bg-[#0a0e18] rounded-md px-4 py-1 text-xs text-white/50 flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#34e89e]/20 mr-2 flex items-center justify-center">
                            <span className="text-[10px] text-[#34e89e]">C</span>
                        </div>
                        carrio.app/dashboard/job-matches
                    </div>
                </div>

                {/* Job Matches Preview */}
                <div className="rounded-xl  bg-[#030508] relative p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <div className="h-8 w-1/4 bg-white/5 rounded-md"></div> {/* Title Placeholder */}
                        <div className="h-8 w-20 bg-white/10 rounded-md flex items-center justify-center">
                            {/* Filter Icon Placeholder */}
                            <div className="w-4 h-4 bg-white/20 rounded-sm mr-1"></div>
                            <div className="h-3 w-8 bg-white/20 rounded-sm"></div>
                        </div>
                    </div>

                    {/* Job Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 rounded-xl mb-8">
                        {mockJobMatches.map((job, i) => (
                            <div
                                key={i}
                                className="bg-[#0a0e18]/60 border border-white/10 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 text-[10px] sm:text-xs"
                            >
                                {/* Card Header */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold text-sm sm:text-base text-white/90 truncate">
                                            {job.title}
                                        </div>
                                        <div className="text-white/60">{job.company}</div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`text-[8px] sm:text-[10px] px-1.5 py-0.5 ${
                                            statusBadgeColors[job.statusColor as keyof typeof statusBadgeColors]
                                        }`}
                                    >
                                        {job.status}
                                    </Badge>
                                </div>

                                {/* Details Row 1 */}
                                <div className="flex justify-between items-center text-white/50">
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Briefcase className="w-3 h-3" />
                                        <span>{job.type}</span>
                                    </div>
                                </div>

                                {/* Match Percentage */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 pt-1">
                                    {/* Salary Placeholder - now takes full width on mobile */}
                                    <div className="h-4 w-2/3 sm:w-28 bg-white/10 rounded-md"></div>
                                    {/* Match Info - aligns left on mobile, right on sm+ */}
                                    <div className="flex items-center space-x-1.5 self-start sm:self-center">
                                        <span
                                            className={`font-medium ${
                                                job.match > 80 ? 'text-emerald-400' : 'text-green-500'
                                            }`}
                                        >
                                            {job.match}% Match
                                        </span>
                                        <Progress
                                            value={job.match}
                                            className={`w-16 h-1.5 ${
                                                progressColors[job.match as keyof typeof progressColors]
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Details Row 2 */}
                                <div className="flex justify-between items-center text-white/50">
                                    <div className="flex items-center space-x-1">
                                        <Info className="w-3 h-3" />
                                        <span>{job.level}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{job.posted}</span>
                                    </div>
                                </div>

                                {/* Description Placeholder */}
                                <div className="space-y-1 pt-1">
                                    <div className="h-2 w-full bg-white/5 rounded-sm"></div>
                                    <div className="h-2 w-full bg-white/5 rounded-sm"></div>
                                    <div className="h-2 w-3/4 bg-white/5 rounded-sm"></div>
                                </div>

                                {/* Skills */}
                                <div className="flex items-center space-x-1 pt-1">
                                    <Info className="w-3 h-3 text-white/50 flex-shrink-0" />
                                    <div className="flex flex-wrap gap-1">
                                        {job.skills.slice(0, 5).map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="text-[8px] sm:text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-400"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                        {job.skills.length > 5 && (
                                            <Badge
                                                variant="secondary"
                                                className="text-[8px] sm:text-[10px] px-1.5 py-0.5 bg-white/10 text-white/50 border-white/20 hover:bg-white/10 hover:text-white"
                                            >
                                                +{job.skills.length - 5} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        size="sm"
                                        className="pointer-events-none flex-1 text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        Apply
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                        className="pointer-events-none flex-1 text-xs h-7 bg-white/10 border-white/20 hover:bg-white/10 hover:text-white"
                                    >
                                        See Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reflection effect */}
                    <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#030508] via-[#030508]/80 to-transparent rounded-xl"></div>
                </div>
            </div>

            {/* Glow beneath */}
            <div className="absolute -bottom-10 inset-x-0 h-20 bg-[#34e89e]/20 blur-3xl rounded-full"></div>
        </motion.div>
    );
}

export default JobMatchesMockup;
