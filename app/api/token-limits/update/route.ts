import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient();
        
        const { data: { session } } = await (await supabase).auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { tokensUsed } = await req.json();
        
        if (typeof tokensUsed !== 'number') {
            return NextResponse.json({ error: 'Invalid token usage value' }, { status: 400 });
        }

        const { error } = await (await supabase).rpc('increment_token_usage', {
            user_id: session.user.id,
            amount: tokensUsed
        });

        if (error) {
            console.error('Token update error:', error);
            return NextResponse.json({ error: 'Failed to update token usage' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Token update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}