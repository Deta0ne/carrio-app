import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check authentication
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const sort = searchParams.get('sort') || 'created_at:desc';
        
        // Parse sort parameter
        const [sortField, sortOrder] = sort.split(':');
        const validSortFields = ['created_at', 'application_date', 'company_name', 'position'];
        const validSortOrders = ['asc', 'desc'];
        
        const finalSortField = validSortFields.includes(sortField) ? sortField : 'created_at';
        const finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

        // Fetch applications
        const { data: applications, error } = await supabase
            .from('job_applications')
            .select('*')
            .eq('user_id', user.id)
            .order(finalSortField, { ascending: finalSortOrder === 'asc' })
            .limit(limit);

        if (error) {
            console.error('Error fetching applications:', error);
            return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            applications: applications || [],
            count: applications?.length || 0,
        });
    } catch (error) {
        console.error('Unexpected error in GET /api/applications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 