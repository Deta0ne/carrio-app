import { Metadata } from 'next';
import SupportRequestForm from '@/components/forms/support-request-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const metadata: Metadata = {
    title: 'Support',
    description: 'Submit a support request or find answers to your questions.',
};

const faqData = [
    {
        question: 'How does the job application tracking work?',
        answer: 'Our system allows you to add job applications manually or via integrations, track their status (Applied, Interviewing, Offer, Rejected), store relevant documents, set reminders, and view analytics on your job search progress.',
    },
    {
        question: 'How can I add a new application?',
        answer: "You can add a new application by clicking the 'Add Application' button on the my applications page. You'll need to fill in details like company name, job title, application date, and optionally add a link.",
    },
    {
        question: 'What do the different job statuses mean?',
        answer: "'Applied': You've submitted your application. 'Interviewing': You have one or more interviews scheduled. 'Offer': You received a job offer. 'Rejected': You are no longer being considered. 'Planned': An application you plan to apply to.",
    },
    {
        question: 'Can I save jobs for later?',
        answer: "Yes, you can use the 'Planned' status to save jobs you are interested in but haven't applied to yet. You can update the status later when you apply.",
    },
    {
        question: 'How do I update my profile or settings?',
        answer: 'You can access your profile and account settings by clicking on your profile picture',
    },
    {
        question: 'How do I delete an application?',
        answer: 'You can delete an application by clicking the "Delete" button on the my applications page.',
    },
    {
        question: 'How do I add a CV?',
        answer: 'You can add a CV by clicking the "Upload New CV" button on the Document Management page.',
    },
    {
        question: 'How is the match score on job postings calculated?',
        answer: 'The match score is calculated based on the job posting and your CV. How match score is calculated:\n• Required skills: 70% weight\n• Preferred skills: 30% weight',
    },
];

export default function SupportPage() {
    return (
        <div className="container mx-auto py-10">
            {/* Sekmeleri içeren ana container */}
            <Tabs defaultValue="support" className="max-w-3xl mx-auto">
                {' '}
                {/* Genişliği biraz artırabiliriz */}
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="support">Submit Request</TabsTrigger>
                    <TabsTrigger value="faq">FAQs</TabsTrigger>
                </TabsList>
                {/* Destek Formu Sekmesi İçeriği */}
                <TabsContent value="support">
                    <div className="mt-6">
                        {' '}
                        {/* Üstten biraz boşluk */}
                        <SupportRequestForm />
                    </div>
                </TabsContent>
                {/* SSS Sekmesi İçeriği */}
                <TabsContent value="faq">
                    <div className="mt-6 space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">Frequently Asked Questions</h2>
                            <p className="text-sm text-muted-foreground">
                                Find answers to common questions about our job application tracker.
                            </p>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            {faqData.map((item, index) => (
                                <AccordionItem value={item.question} key={item.question}>
                                    <AccordionTrigger>{item.question}</AccordionTrigger>
                                    <AccordionContent>{item.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        <Separator />
                        <div className="text-center text-sm text-muted-foreground">
                            <p>Can't find what you're looking for?</p>
                            {/* İleride buraya support sekmesine geçiş linki eklenebilir */}
                            <p>Use the 'Submit Request' tab to contact our support team.</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
