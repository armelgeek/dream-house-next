import { Suspense } from 'react';
import type { Metadata } from 'next';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { MessagingInterface } from '@/features/messaging/components/organisms/messaging-interface';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Messages | Dream House',
  description: 'Communicate with property owners and potential buyers',
};

export default async function MessagesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with property owners and potential buyers
        </p>
      </div>
      
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        }
      >
        <MessagingInterface currentUserId={session.user.id} />
      </Suspense>
    </div>
  );
}