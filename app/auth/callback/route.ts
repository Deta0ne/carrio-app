import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type === 'recovery') {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      redirect('/reset?recovery=true');
    } else {
      redirect('/error?code=TOKEN_VERIFICATION_FAILED');
    }
  } else if (token_hash && type === 'signup') {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      redirect('/home?message=EmailVerified');
    } else {
      redirect('/error?code=SIGNUP_VERIFICATION_FAILED');
    }
  }

  redirect('/error?code=INVALID_CALLBACK_PARAMS');
}