import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className="flex items-center gap-2">
                    <Image
                        className="dark:invert"
                        src="/next.svg"
                        alt="Carrier logo"
                        width={180}
                        height={38}
                        priority
                    />
                </div>
                <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                    <li className="mb-2">
                        Start tracking your job applications{' '}
                        <a href="/register" className="text-primary hover:underline">
                            Create an account
                        </a>
                    </li>
                    <li className="mb-2">
                        Already have an account?{' '}
                        <a href="/login" className="text-primary hover:underline">
                            Sign in
                        </a>
                    </li>
                    <li className="mb-2">
                        Go to account page{' '}
                        <a href="/account" className="text-primary hover:underline">
                            Account
                        </a>
                    </li>

                    <li>
                        Go to home page{' '}
                        <a href="/" className="text-primary hover:underline">
                            Home
                        </a>
                    </li>
                </ol>
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <a
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                        href="/register"
                    >
                        Get Started
                    </a>
                    <a
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                        href="/login"
                    >
                        Sign In
                    </a>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="/features">
                    <Image aria-hidden src="/file.svg" alt="Features" width={16} height={16} />
                    Features
                </a>
                <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="/pricing">
                    <Image aria-hidden src="/window.svg" alt="Pricing" width={16} height={16} />
                    Pricing
                </a>
                <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="/about">
                    <Image aria-hidden src="/globe.svg" alt="About" width={16} height={16} />
                    About Us →
                </a>
            </footer>
        </div>
    );
}
