import { Metadata } from 'next';
import SupportRequestForm from '@/components/forms/support-request-form';

export const metadata: Metadata = {
    title: 'Support',
    description: 'Submit a support request or find answers to your questions.',
};

export default function SupportPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <SupportRequestForm />
            </div>
        </div>
    );
}
