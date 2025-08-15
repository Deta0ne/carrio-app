import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';

const createApplicationSchema = z.object({
  company_name: z.string().min(1).max(100),
  position: z.string().min(1).max(150),
  status: z.enum(['draft', 'pending', 'interview_stage', 'offer_received', 'rejected', 'planned']).default('pending'),
  application_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  source: z.enum(['LinkedIn', 'Company Website', 'Indeed', 'GitHub Jobs', 'Career Website', 'Other']).default('LinkedIn'),
  company_website: z.string().url().optional().nullable(),
  job_description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  salary: z.string().optional().nullable(),
  job_id: z.string().optional().nullable(),
  application_type: z.enum(['standard', 'easy']).optional().nullable(),
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
    const validation = createApplicationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Check if application already exists
    const { data: existingApplication } = await supabase
      .from('job_applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('company_name', validatedData.company_name)
      .eq('position', validatedData.position)
      .single();

    if (existingApplication) {
      return NextResponse.json(
        { 
          message: 'Application already exists',
          duplicate: true,
          applicationId: existingApplication.id
        },
        { status: 409 }
      );
    }

    // Create new application
    const applicationId = uuidv4();
    const { data: newApplication, error } = await supabase
      .from('job_applications')
      .insert({
        id: applicationId,
        user_id: user.id,
        company_name: validatedData.company_name,
        position: validatedData.position,
        status: validatedData.status,
        application_date: validatedData.application_date,
        source: validatedData.source,
        company_website: validatedData.company_website,
        job_description: validatedData.job_description,
        location: validatedData.location,
        salary: validatedData.salary,
        job_id: validatedData.job_id,
        application_type: validatedData.application_type,
        created_at: new Date().toISOString(),
        last_update: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating application:', error);
      return NextResponse.json(
        { message: 'Failed to create application' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Application created successfully',
        application: newApplication
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('API Applications Create - Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 