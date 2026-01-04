import prisma from '@/lib/db';
import { EmailSubmissionsClient } from './components/EmailSubmissionsClient';

export default async function EmailSubmissionsPage() {
  const emailSubmissions = await prisma.emailSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const formattedSubmissions = emailSubmissions.map((submission) => ({
    id: submission.id_email_submission,
    client_email: submission.client_email,
    created_at: submission.createdAt.toISOString().replace('T', ' ').substring(0, 19),
  }));

  // Calculate stats
  const now = new Date();
  const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = {
    total: emailSubmissions.length,
    thisWeek: emailSubmissions.filter(e => e.createdAt >= thisWeekStart).length,
    thisMonth: emailSubmissions.filter(e => e.createdAt >= thisMonthStart).length,
  };

  return <EmailSubmissionsClient initialSubmissions={formattedSubmissions} stats={stats} />;
}
