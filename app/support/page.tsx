import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import SupportRequestForm from '@/components/forms/support-request-form';
import GuestSupportRequestForm from '@/components/forms/guest-support-request-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Support & FAQs',
    description: 'Submit a support request or find answers to your questions.',
};

const faqData = [
    {
        id: 'faq-track',
        question: 'How does the job application tracking work?',
        answer: 'Our system allows you to add job applications manually or via integrations, track their status (Applied, Interviewing, Offer, Rejected), store relevant documents, set reminders, and view analytics on your job search progress.',
    },
    {
        id: 'faq-add',
        question: 'How can I add a new application?',
        answer: "You can add a new application by clicking the 'Add Application' button on the my applications page. You'll need to fill in details like company name, job title, application date, and optionally add a link.",
    },
    {
        id: 'faq-status',
        question: 'What do the different job statuses mean?',
        answer: "'Applied': You've submitted your application. 'Interviewing': You have one or more interviews scheduled. 'Offer': You received a job offer. 'Rejected': You are no longer being considered. 'Planned': An application you plan to apply to.",
    },
    {
        id: 'faq-save',
        question: 'Can I save jobs for later?',
        answer: "Yes, you can use the 'Planned' status to save jobs you are interested in but haven't applied to yet. You can update the status later when you apply.",
    },
    {
        id: 'faq-profile',
        question: 'How do I update my profile or settings?',
        answer: 'You can access your profile and account settings by clicking on your profile picture',
    },
    {
        id: 'faq-delete',
        question: 'How do I delete an application?',
        answer: 'You can delete an application by clicking the "Delete" button on the my applications page.',
    },
    {
        id: 'faq-cv',
        question: 'How do I add a CV?',
        answer: 'You can add a CV by clicking the "Upload New CV" button on the Document Management page.',
    },
    {
        id: 'faq-score',
        question: 'How is the match score on job postings calculated?',
        answer: 'The match score is calculated based on the job posting and your CV. How match score is calculated:\n• Required skills: 70% weight\n• Preferred skills: 30% weight',
    },
];

export default async function SupportPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isLoggedIn = !!user;
    return (
        <div className="container mx-auto px-4 py-6 sm:py-10 min-h-[calc(100vh-4rem)]">
            <div className="max-w-3xl mx-auto space-y-6">
                <Link href={isLoggedIn ? '/home' : '/'}>
                    <Button variant="outline" className="mb-6">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Home
                    </Button>
                </Link>
                <Tabs defaultValue="support" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="support">Submit Request</TabsTrigger>
                        <TabsTrigger value="faq">FAQs</TabsTrigger>
                    </TabsList>
                    <TabsContent value="support" className="mt-0">
                        <div className="space-y-6 mt-4">
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                                    Submit a Support Request
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Fill out the form below and our support team will get back to you as soon as
                                    possible.
                                </p>
                            </div>
                            {isLoggedIn ? <SupportRequestForm /> : <GuestSupportRequestForm />}
                        </div>
                    </TabsContent>
                    <TabsContent value="faq" className="mt-4">
                        <div className="space-y-6">
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Find answers to common questions about our job application tracker.
                                </p>
                            </div>
                            <Accordion type="single" collapsible className="w-full">
                                {faqData.map((item) => (
                                    <AccordionItem value={item.id} key={item.id}>
                                        <AccordionTrigger className="text-sm sm:text-base">
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-sm">{item.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                            <Separator />
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">Can't find what you're looking for?</p>
                                <p className="text-sm text-muted-foreground">
                                    Use the 'Submit Request' tab to contact our support team.
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
