'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUploader } from './DocumentUploader';
import { DocumentViewer } from './DocumentViewer';
import { DocumentProcessingStatus } from './DocumentProcessingStatus';
import { SkillsDisplay } from './SkillsDisplay';
import { useDocumentProcessor } from './hooks/useDocumentProcessor';
import { DocumentTips } from './DocumentTips';
import { DocumentErrorAlert } from './DocumentErrorAlert';
import { LoadingIndicator } from './LoadingIndicator';
import { ProfileSkillsInfo } from './ProfileSkillsInfo';
import { CategorizedSkills } from './types';
import { Document } from '@/services/documents';
interface DocumentsTabProps {
    initialDocument: Document | null;
    initialCategorizedSkills?: CategorizedSkills | null;
    initialExtractedSkills?: string[] | null;
    initialIsSkillsSaved?: boolean;
    defaultActiveTab?: string;
}

export function DocumentsTab({
    initialDocument,
    initialCategorizedSkills = null,
    initialExtractedSkills = null,
    initialIsSkillsSaved = false,
    defaultActiveTab = 'document',
}: DocumentsTabProps) {
    const {
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
    } = useDocumentProcessor({
        initialDocument: initialDocument as Document,
        initialCategorizedSkills,
        initialExtractedSkills,
        initialIsSkillsSaved,
    });

    const [activeTab, setActiveTab] = useState<string>(document ? 'analysis' : 'document');

    const isLoadingProfile = false;

    return (
        <Card style={{ backgroundColor: 'transparent' }}>
            <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>Upload your resume for automatic analysis</CardDescription>
            </CardHeader>
            <CardContent>
                {uploadError && <DocumentErrorAlert message={uploadError} />}

                {isLoadingProfile ? (
                    <LoadingIndicator message="Loading your profile data..." />
                ) : !document && !isProcessing && !categorizedSkills ? (
                    <DocumentUploader onUpload={handleFileUpload} />
                ) : isProcessing ? (
                    <DocumentProcessingStatus status={processStatus} progress={processProgress} />
                ) : document ? (
                    <DocumentViewer
                        document={document}
                        isSkillsSaved={isSkillsSaved}
                        onDelete={handleDelete}
                        onDownload={handleDownload}
                        onReplace={handleFileUpload}
                    />
                ) : null}

                {!document && !isProcessing && categorizedSkills && (
                    <ProfileSkillsInfo onUploadNew={handleFileUpload} />
                )}

                {(categorizedSkills || document) && (
                    <div className="mt-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid grid-cols-2 mb-4">
                                <TabsTrigger value="document">Document</TabsTrigger>
                                <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
                            </TabsList>

                            <TabsContent value="document">
                                <DocumentTips />
                            </TabsContent>

                            <TabsContent value="analysis">
                                {categorizedSkills && <SkillsDisplay categorizedSkills={categorizedSkills} />}
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

                {!document && !isProcessing && !categorizedSkills && <DocumentTips />}
            </CardContent>
        </Card>
    );
}
