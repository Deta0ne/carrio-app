'use client';

import { useState, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

// Kategorize edilmiş beceri tipi tanımı
interface CategorizedSkills {
    'Technical Skills': string[];
    'Soft Skills': string[];
    'Domain Knowledge': string[];
    Languages: string[];
    Education: string[];
    'Job Titles': string[];
    Responsibilities: string[];
    [key: string]: string[];
}

// Response tipi
interface SkillsResponse {
    parsedText: string;
    skills?: string[];
    categorized_skills?: CategorizedSkills;
}

export default function FileUpload() {
    const [fileResponse, setFileResponse] = useState<SkillsResponse | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        if (file.type !== 'application/pdf') {
            toast.error('Please upload a PDF file');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setFileResponse(data);

            // CV içeriğinden becerileri çıkarmak için API çağrısı yap
            setIsProcessing(true);
            const skillsResponse = await fetch('/api/extract-skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: data.parsedText }),
            });

            if (!skillsResponse.ok) {
                throw new Error('Skills extraction failed');
            }

            const skillsData = await skillsResponse.json();
            setFileResponse((prev) =>
                prev
                    ? {
                          ...prev,
                          skills: skillsData.skills,
                          categorized_skills: skillsData.categorized_skills,
                      }
                    : null,
            );

            setIsProcessing(false);
            toast.success('CV analysis complete');

            // İleride Supabase'e kaydetmek için burada bir fonksiyon çağrılabilir
            // Örneğin: saveUserSkillsToDatabase(currentUser.id, skillsData.skills, skillsData.categorized_skills)
        } catch (error) {
            toast.error('Failed to process file');
            console.error('Process error:', error);
            setIsProcessing(false);
        } finally {
            setIsUploading(false);
        }
    }, []);
    console.log('fileResponse', fileResponse?.categorized_skills);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
    });

    return (
        <div className="container mx-auto p-4">
            <Toaster />

            {!fileResponse && (
                <div
                    {...getRootProps()}
                    className={cn(
                        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                        'hover:border-blue-500 hover:bg-blue-50',
                        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
                        isUploading ? 'opacity-50 cursor-not-allowed' : '',
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <div className="text-lg font-medium">
                            {isDragActive
                                ? 'Drop the PDF here'
                                : isUploading || isProcessing
                                ? isProcessing
                                    ? 'Analyzing CV...'
                                    : 'Uploading...'
                                : 'Drag & drop your CV here'}
                        </div>
                        <p className="text-sm text-gray-500">or click to select a file</p>
                    </div>
                </div>
            )}

            {fileResponse && (
                <div className="mt-8 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">CV Analysis Results</h2>

                    {isProcessing ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                            <p>Analyzing CV content...</p>
                        </div>
                    ) : fileResponse.categorized_skills ? (
                        <div className="space-y-6">
                            <p className="text-gray-600 mb-4">
                                We've extracted the following keywords from your CV that can be used to match with job
                                listings:
                            </p>

                            {/* API'den doğrudan kategorilendirilmiş becerileri kullanma */}
                            {Object.entries(fileResponse.categorized_skills).map(
                                ([category, skills]) =>
                                    skills.length > 0 && (
                                        <div key={category} className="mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{category}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                            )}

                            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <p className="text-sm text-blue-700">
                                    These keywords are automatically extracted and categorized to help you match your
                                    profile with job requirements. You can use these to optimize your job applications.
                                </p>
                            </div>

                            <div className="mt-6 flex justify-between">
                                <button
                                    onClick={() => setFileResponse(null)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Upload Another CV
                                </button>

                                <button
                                    onClick={() => {
                                        // Burada veritabanına kaydetme işlemi yapılabilir
                                        toast.success('Skills saved to your profile');
                                    }}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                >
                                    Save to My Profile
                                </button>
                            </div>
                        </div>
                    ) : (
                        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded border">
                            {fileResponse.parsedText}
                        </pre>
                    )}

                    {!fileResponse.categorized_skills && (
                        <button
                            onClick={() => setFileResponse(null)}
                            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Upload Another CV
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
