import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import * as z from 'zod';

const checkSchema = z.object({
  company_name: z.string().min(1),
  position: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validation = checkSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { company_name, position } = validation.data;

    // Check if application exists
    const { data: existingApplication, error } = await supabase
      .from('job_applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('company_name', company_name)
      .eq('position', position)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking application:', error);
      return NextResponse.json(
        { message: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: !!existingApplication,
      applicationId: existingApplication?.id || null
    });

  } catch (error) {
    console.error('API Applications Check - Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 