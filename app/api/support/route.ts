import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import * as z from 'zod';

const issueTypes = [
    'Account Issues',
    'Technical Problems',
    'Feature Request',
    'Job Application Issues',
    'Other',
] as const;

const baseSchema = z.object({
    issueType: z.enum(issueTypes),
    description: z.string().min(10).max(1000),
});

const guestSchema = baseSchema.extend({
    name: z.string().min(2),
    email: z.string().email(),
});

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const isLoggedIn = !!user;
        const body = await request.json();
        let validation;
        let dataToInsert;

        if (isLoggedIn) {
            validation = baseSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json(
                    { message: 'Invalid input', errors: validation.error.format() },
                    { status: 400 }
                );
            }
            const { issueType, description } = validation.data;
            dataToInsert = {
                user_id: user.id,
                issue_type: issueType,
                description: description,
                guest_name: null,
                guest_email: null,
            };
        } else {
            validation = guestSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json(
                    { message: 'Invalid input', errors: validation.error.format() },
                    { status: 400 }
                );
            }
            const { name, email, issueType, description } = validation.data;
            dataToInsert = {
                user_id: null,
                issue_type: issueType,
                description: description,
                guest_name: name,
                guest_email: email,
            };
        }

        const { error: insertError } = await supabase
            .from('support_requests')
            .insert(dataToInsert);

        if (insertError) {
            console.error('API Support - Supabase Insert Error:', insertError.message);
            return NextResponse.json(
                { message: 'Failed to submit support request. Please try again later.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Support request submitted successfully!' },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('API Support - Catch Error:', error);
        return NextResponse.json(
            { message: 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}