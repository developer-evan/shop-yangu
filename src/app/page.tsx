'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div
    className="flex flex-col items-center justify-center h-screen"
    >
      <h1>Home</h1>
      <button 
        onClick={() => router.push('/dashboard')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
