import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import * as z from 'zod';

const issueTypes = [
    'Account Issues',
    'Technical Problems',
    'Feature Request',
    'Job Application Issues',
    'Other',
] as const;

const formSchema = z.object({
    issueType: z.enum(issueTypes),
    description: z.string().min(10).max(1000),
});

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    try {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
            console.error('User Error:', userError.message);
            return NextResponse.json(
                { message: 'Error getting user' },
                { status: 500 }
            );
        }

        if (!user?.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = user.id;

        const body = await request.json();
        const validation = formSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: validation.error.format() },
                { status: 400 }
            );
        }

        const { issueType, description } = validation.data;

        const { error: insertError } = await supabase
            .from('support_requests')
            .insert({
                user_id: userId,
                issue_type: issueType, 
                description: description,
            });

        if (insertError) {
            console.error('Supabase Insert Error:', insertError.message);
            return NextResponse.json(
                {
                    message:
                        'Failed to submit support request. Please try again.',
                    error: insertError.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Support request submitted successfully!' },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { message: 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}