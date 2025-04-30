import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Document, uploadDocument, deleteDocument, downloadDocument } from '@/services/documents';
import { profileService } from '@/services/profile-service';
import { CategorizedSkills } from '../types';

export function useDocumentProcessor({
    initialDocument,
    initialCategorizedSkills,
    initialExtractedSkills,
    initialIsSkillsSaved,
}: {
    initialDocument: Document | null;
    initialCategorizedSkills: CategorizedSkills | null;
    initialExtractedSkills: string[] | null;
    initialIsSkillsSaved: boolean;
}) {
    const router = useRouter();
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [document, setDocument] = useState<Document | null>(initialDocument);
    const [isProcessing, setIsProcessing] = useState(false);
    const [parsedText, setParsedText] = useState<string | null>(null);
    const [extractedSkills, setExtractedSkills] = useState<string[] | null>(initialExtractedSkills);
    const [categorizedSkills, setCategorizedSkills] = useState<CategorizedSkills | null>(initialCategorizedSkills);
    const [isSkillsSaved, setIsSkillsSaved] = useState(initialIsSkillsSaved);
    const [processStatus, setProcessStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'saving' | 'complete'>(
        'idle',
    );
    const [processProgress, setProcessProgress] = useState(0);

    const validateFile = (file: File): string | null => {
        if (file.type !== 'application/pdf') {
            return 'Only PDF files are supported';
        }

        if (file.size > 5 * 1024 * 1024) {
            return 'File size must be less than 5MB';
        }

        return null;
    };

    const checkTokenAvailability = async (): Promise<{isAvailable: boolean, remaining: number}> => {
        const tokenCheckResponse = await fetch('/api/token-limits/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!tokenCheckResponse.ok) {
            throw new Error('Failed to check token availability');
        }

        return tokenCheckResponse.json();
    };

    const handleFileUpload = async (file: File) => {
        const error = validateFile(file);
        if (error) {
            setUploadError(error);
            return;
        }

        try {
            const { isAvailable, remaining } = await checkTokenAvailability();
            if (!isAvailable) {
                toast.error(`Token limit exceeded. You have ${remaining} tokens remaining.`);
                return;
            }

            setUploadError(null);
            await processCV(file);
        } catch (error) {
            console.error('File upload error:', error);
            setUploadError('An error occurred while checking token availability');
        }
    };

    const processCV = async (file: File) => {
        setIsProcessing(true);
        setProcessStatus('uploading');
        setProcessProgress(0);
        setParsedText(null);
        setExtractedSkills(null);
        setCategorizedSkills(null);
        setIsSkillsSaved(false);

        const processInterval = setInterval(() => {
            setProcessProgress((prev) => {
                if (prev < 25) return prev + 1;
                if (prev < 50 && processStatus === 'analyzing') return prev + 0.5;
                if (prev < 90 && processStatus === 'saving') return prev + 0.2;
                return prev;
            });
        }, 100);

        try {
            // 1. Delete existing document (if exists)
            if (document) {
                await deleteDocument(document);
            }

            // 2. Upload CV
            toast.info('Uploading your CV...');
            const uploadedDocument = await uploadDocument(file);
            setDocument(uploadedDocument);
            setProcessStatus('analyzing');
            setProcessProgress(25);
            toast.info('CV uploaded, analyzing content...');

            // 3-4. Download and analyze PDF content
            const pdfUrl = await downloadDocument(uploadedDocument);
            const extractData = await extractTextFromPdf(pdfUrl, uploadedDocument.name);
            setParsedText(extractData.parsedText);
            setProcessProgress(50);

            // 5. Extract skills from parsed text
            const skillsData = await extractSkillsFromText(extractData.parsedText);
            setExtractedSkills(skillsData.skills);
            setCategorizedSkills(skillsData.categorized_skills);
            setProcessStatus('saving');
            setProcessProgress(75);
            toast.info('Skills extracted, saving to your profile...');

            // 6. Save skills to profile
            await saveSkillsToProfile(skillsData);
            setIsSkillsSaved(true);

            // 7. Process completed
            clearInterval(processInterval);
            setProcessProgress(100);
            setProcessStatus('complete');
            toast.success('CV processed and skills saved successfully!');
            router.refresh();
            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        } catch (error) {
            console.error('CV processing error:', error);
            toast.error('Failed to process CV. Please try again.');
            setUploadError('Failed to process CV. Please try again.');
            setIsProcessing(false);
            clearInterval(processInterval);
        }
    };

    const extractTextFromPdf = async (pdfUrl: string, filename: string) => {
        const formData = new FormData();
        const pdfResponse = await fetch(pdfUrl);
        const pdfBlob = await pdfResponse.blob();
        formData.append('file', pdfBlob, filename);

        const extractResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!extractResponse.ok) {
            throw new Error('Failed to extract text from CV');
        }

        return extractResponse.json();
    };

    const extractSkillsFromText = async (text: string) => {
        const skillsResponse = await fetch('/api/extract-skills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!skillsResponse.ok) {
            throw new Error('Failed to analyze CV content');
        }

        return skillsResponse.json();
    };

    const saveSkillsToProfile = async ( skillsData: any) => {
        const result = await profileService.saveProfileSkills(
            skillsData.skills,
            skillsData.categorized_skills,
        );

        const tokenUpdateResponse = await fetch('/api/token-limits/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tokensUsed: skillsData.token_usage.total_tokens,
            }),
        });
        
        if (!tokenUpdateResponse.ok) {
            throw new Error('Failed to update token usage');
        }

        if (!result.success) {
            throw new Error('Failed to save skills to profile');
        }

        return result;
    };

    const handleDelete = async () => {
        if (!document) return;

        try {
            toast.loading('Deleting document...');
            await deleteDocument(document);
            setDocument(null);
            setParsedText(null);
            toast.dismiss();
            toast.success('Document deleted successfully');
            router.refresh();
        } catch (error) {
            console.error('Delete error:', error);
            toast.dismiss();
            toast.error('Failed to delete document');
        }
    };

    const handleDownload = async () => {
        if (!document) return;

        try {
            const url = await downloadDocument(document);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download document');
        }
    };

    return {
        document,
        processStatus,
        processProgress,
        uploadError,
        categorizedSkills,
        isSkillsSaved,
        isProcessing,
        handleFileUpload,
        handleDelete,
        handleDownload,
    };
}