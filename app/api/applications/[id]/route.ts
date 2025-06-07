import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const supabase = await createClient();
        const params = await context.params;
        const { id } = params;

        // Check authentication
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch the specific application
        const { data: application, error } = await supabase
            .from('job_applications')
            .select('id, position, company_name, status, application_date, created_at')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) {
            console.error('Error fetching application:', error);
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            application: application,
        });
    } catch (error) {
        console.error('Unexpected error in GET /api/applications/[id]:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 