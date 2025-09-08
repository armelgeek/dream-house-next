'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import React from 'react';
import { AdminStatsOverview } from '@/features/admin/components/molecules/admin-stats-overview';
import { useAdminStats } from '@/features/admin/hooks/use-admin';

export default function Overview() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Admin Dashboard</h1>
          <p className="text-destructive">
            Failed to load admin statistics. Please check your permissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col space-y-2'>
        <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Admin Dashboard</h1>
        <p className="mb-2 text-muted-foreground text-sm md:text-base">
          Overview of platform metrics and recent activities.
        </p>
      </div>

      <AdminStatsOverview stats={stats!} loading={isLoading} />

      <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Platform activity over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">New Users</span>
                  <span className="font-medium">{stats.recentActivity.newUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">New Properties</span>
                  <span className="font-medium">{stats.recentActivity.newProperties}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">New Messages</span>
                  <span className="font-medium">{stats.recentActivity.newMessages}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='col-span-3 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a 
                href="/d/dashboard/users" 
                className="block text-sm text-primary hover:underline"
              >
                Manage Users
              </a>
              <a 
                href="/d/dashboard/properties" 
                className="block text-sm text-primary hover:underline"
              >
                Moderate Properties
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}