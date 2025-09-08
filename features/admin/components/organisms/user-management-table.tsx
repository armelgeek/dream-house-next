'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Trash2, Ban, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import type { UserWithStats, UserModeration } from '../../config/admin.schema';

interface UserManagementTableProps {
  users: UserWithStats[];
  loading?: boolean;
  onModerateUser: (data: UserModeration) => Promise<void>;
}

export function UserManagementTable({ 
  users, 
  loading = false, 
  onModerateUser 
}: UserManagementTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [moderationAction, setModerationAction] = useState<'suspend' | 'delete' | null>(null);
  const [moderating, setModerating] = useState(false);

  const handleModerationConfirm = async () => {
    if (!selectedUser || !moderationAction) return;

    setModerating(true);
    try {
      await onModerateUser({
        userId: selectedUser.id,
        action: moderationAction,
        reason: `Admin action: ${moderationAction} user`,
      });
      
      toast.success(`User ${moderationAction}d successfully`);
      setSelectedUser(null);
      setModerationAction(null);
    } catch (error) {
      console.error('Moderation error:', error);
      toast.error(`Failed to ${moderationAction} user`);
    } finally {
      setModerating(false);
    }
  };

  const openModerationDialog = (user: UserWithStats, action: 'suspend' | 'delete') => {
    setSelectedUser(user);
    setModerationAction(action);
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || ''} alt={user.name} />
                      <AvatarFallback>
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{user.propertyCount}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isSuspended ? 'destructive' : 'default'}>
                    {user.isSuspended ? 'Suspended' : 'Active'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.isSuspended ? (
                        <DropdownMenuItem onClick={() => openModerationDialog(user, 'suspend')}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Unsuspend
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => openModerationDialog(user, 'suspend')}>
                          <Ban className="mr-2 h-4 w-4" />
                          Suspend
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => openModerationDialog(user, 'delete')}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!selectedUser && !!moderationAction} onOpenChange={() => {
        setSelectedUser(null);
        setModerationAction(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {moderationAction === 'delete' ? 'Delete User' : 
               moderationAction === 'suspend' ? 
                 (selectedUser?.isSuspended ? 'Unsuspend User' : 'Suspend User') : 
                 'Moderate User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {moderationAction === 'delete' 
                ? `Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone and will remove all their data including properties and messages.`
                : moderationAction === 'suspend'
                ? selectedUser?.isSuspended 
                  ? `Are you sure you want to unsuspend ${selectedUser?.name}? They will regain access to their account.`
                  : `Are you sure you want to suspend ${selectedUser?.name}? They will lose access to their account.`
                : 'Please confirm this moderation action.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={moderating}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleModerationConfirm}
              disabled={moderating}
              className={moderationAction === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {moderating ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}