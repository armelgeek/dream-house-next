import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Home, MessageSquare, TrendingUp } from 'lucide-react';
import type { AdminStats } from '../../config/admin.schema';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
}

function StatsCard({ title, value, icon, change, changeType = 'neutral' }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {change !== undefined && (
          <p className={`text-xs ${
            changeType === 'positive' ? 'text-green-600' :
            changeType === 'negative' ? 'text-red-600' :
            'text-muted-foreground'
          }`}>
            {change > 0 ? '+' : ''}{change} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface AdminStatsOverviewProps {
  stats: AdminStats;
  loading?: boolean;
}

export function AdminStatsOverview({ stats, loading = false }: AdminStatsOverviewProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Users"
        value={stats.totalUsers}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        change={stats.recentActivity.newUsers}
        changeType="positive"
      />
      <StatsCard
        title="Total Properties"
        value={stats.totalProperties}
        icon={<Home className="h-4 w-4 text-muted-foreground" />}
        change={stats.recentActivity.newProperties}
        changeType="positive"
      />
      <StatsCard
        title="Total Messages"
        value={stats.totalMessages}
        icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
        change={stats.recentActivity.newMessages}
        changeType="positive"
      />
      <StatsCard
        title="Active Users"
        value={stats.activeUsers}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}