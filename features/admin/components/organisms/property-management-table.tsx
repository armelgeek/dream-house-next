'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { MoreHorizontal, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import type { PropertyWithModerationInfo, PropertyModeration } from '../../config/admin.schema';

interface PropertyManagementTableProps {
  properties: PropertyWithModerationInfo[];
  loading?: boolean;
  onModerateProperty: (data: PropertyModeration) => Promise<void>;
}

export function PropertyManagementTable({ 
  properties, 
  loading = false, 
  onModerateProperty 
}: PropertyManagementTableProps) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithModerationInfo | null>(null);
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject' | 'delete' | null>(null);
  const [moderating, setModerating] = useState(false);

  const handleModerationConfirm = async () => {
    if (!selectedProperty || !moderationAction) return;

    setModerating(true);
    try {
      await onModerateProperty({
        propertyId: selectedProperty.id,
        action: moderationAction,
        reason: `Admin action: ${moderationAction} property`,
      });
      
      toast.success(`Property ${moderationAction}d successfully`);
      setSelectedProperty(null);
      setModerationAction(null);
    } catch (error) {
      console.error('Moderation error:', error);
      toast.error(`Failed to ${moderationAction} property`);
    } finally {
      setModerating(false);
    }
  };

  const openModerationDialog = (property: PropertyWithModerationInfo, action: 'approve' | 'reject' | 'delete') => {
    setSelectedProperty(property);
    setModerationAction(action);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'sold': return 'secondary';
      case 'rented': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
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
              <TableHead>Property</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{property.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {property.location}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{property.owner.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {property.owner.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  ${parseFloat(property.price).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(property.status)}>
                    {property.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{property.viewCount}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(property.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {property.status !== 'available' && (
                        <DropdownMenuItem onClick={() => openModerationDialog(property, 'approve')}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      {property.status === 'available' && (
                        <DropdownMenuItem onClick={() => openModerationDialog(property, 'reject')}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => openModerationDialog(property, 'delete')}
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

      <AlertDialog open={!!selectedProperty && !!moderationAction} onOpenChange={() => {
        setSelectedProperty(null);
        setModerationAction(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {moderationAction === 'delete' ? 'Delete Property' : 
               moderationAction === 'approve' ? 'Approve Property' :
               moderationAction === 'reject' ? 'Reject Property' : 
               'Moderate Property'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {moderationAction === 'delete' 
                ? `Are you sure you want to delete "${selectedProperty?.title}"? This action cannot be undone.`
                : moderationAction === 'approve'
                ? `Are you sure you want to approve "${selectedProperty?.title}"? It will become visible to all users.`
                : moderationAction === 'reject'
                ? `Are you sure you want to reject "${selectedProperty?.title}"? It will be hidden from public view.`
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