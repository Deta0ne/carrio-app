import { CheckCircle2 } from 'lucide-react';
import { getCategoryColorClass, getCategoryIcon } from '../hooks';
import { CategorizedSkills } from './types';

interface SkillsDisplayProps {
    categorizedSkills: CategorizedSkills;
}

export function SkillsDisplay({ categorizedSkills }: SkillsDisplayProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Extracted Skills</h3>

                <div className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Saved to your profile
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(categorizedSkills).map(
                    ([category, skills]) =>
                        skills.length > 0 && (
                            <div
                                key={category}
                                className="p-4 rounded-lg border bg-card shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40"
                            >
                                <div className="flex items-center mb-3">
                                    {getCategoryIcon(category)}
                                    <h4 className="text-md font-semibold ml-2">{category}</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColorClass(
                                                category,
                                            )}`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ),
                )}
            </div>

            <SkillsInfoSection />
            <SkillsFeatures />
        </div>
    );
}

function SkillsInfoSection() {
    return (
        <div className="border border-blue-800/50 p-4 rounded-lg mt-6 dark:bg-blue-900/10 dark:border-blue-800/30">
            <div className="flex">
                <div className="mr-4 flex-shrink-0 mt-1">
                    <svg
                        className="h-5 w-5 text-blue-400 dark:text-blue-300"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.75.75 0 00.736-.602A1.75 1.75 0 019 9.75V9zm1 5a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <div>
                    <h5 className="text-sm font-semibold text-blue-400 dark:text-blue-300 mb-1">
                        How are these skills used?
                    </h5>
                    <p className="text-sm text-blue-300 dark:text-blue-400/80">
                        These skills have been automatically extracted from your CV and saved to your profile. Our job
                        matching algorithm will use them to find opportunities that match your expertise.
                    </p>
                </div>
            </div>
        </div>
    );
}

function SkillsFeatures() {
    return (
        <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card flex items-center dark:border-gray-700 dark:bg-gray-900/40">
                <div className="mr-3 p-2 rounded-full bg-purple-950/30 dark:bg-purple-900/20">
                    <svg
                        className="h-5 w-5 text-purple-400 dark:text-purple-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <div>
                    <h5 className="text-sm font-semibold">Job Matching</h5>
                    <p className="text-xs text-muted-foreground">Find jobs that match your skills</p>
                </div>
            </div>

            <div className="p-4 rounded-lg border bg-card flex items-center dark:border-gray-700 dark:bg-gray-900/40">
                <div className="mr-3 p-2 rounded-full bg-blue-950/30 dark:bg-blue-900/20">
                    <svg
                        className="h-5 w-5 text-blue-400 dark:text-blue-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                </div>
                <div>
                    <h5 className="text-sm font-semibold">Skill Suggestions</h5>
                    <p className="text-xs text-muted-foreground">Improve your job matches</p>
                </div>
            </div>
        </div>
    );
}
