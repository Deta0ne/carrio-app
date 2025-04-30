import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = createClient();
        
        const { data: { session } } = await (await supabase).auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requiredTokens = 1500

        const { data: limits, error } = await (await supabase)
            .from('user_token_limits')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

        if (error) {
            console.error('Token limit check error:', error);
            return NextResponse.json({ error: 'Failed to check token limit' }, { status: 500 });
        }

        if (!limits) {
            console.warn(`Token limit record not found: ${session.user.id}`);
            return NextResponse.json({ isAvailable: false });
        }

        const projectedUsage = limits.total_tokens_used + requiredTokens;
        const isAvailable = projectedUsage <= limits.token_limit;

        if (!isAvailable) {
            console.info(`User's token limit is being exceeded. User: ${session.user.id}, Remaining: ${limits.token_limit - limits.total_tokens_used}, Required: ${requiredTokens}`);
        }

        return NextResponse.json({ 
            isAvailable,
            currentUsage: limits.total_tokens_used,
            limit: limits.token_limit,
            remaining: limits.token_limit - limits.total_tokens_used
        });

    } catch (error) {
        console.error('Token check error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}