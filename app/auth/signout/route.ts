import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.auth.signOut()
    }

    revalidatePath('/', 'layout')
    
    const response = NextResponse.redirect(new URL('/login', req.url), {
      status: 302,
    })

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error during sign out:', error)
    return NextResponse.redirect(new URL('/login', req.url), {
      status: 302,
    })
  }
}