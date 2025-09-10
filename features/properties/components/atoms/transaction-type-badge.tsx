import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import { ShoppingCart, Home, Key } from 'lucide-react';
import type { TransactionType } from '../../config/property.schema';

interface TransactionTypeBadgeProps {
  transactionType: TransactionType;
  className?: string;
  showIcon?: boolean;
}

export function TransactionTypeBadge({ 
  transactionType, 
  className,
  showIcon = false 
}: TransactionTypeBadgeProps) {
  const getTransactionConfig = (type: TransactionType) => {
    switch (type) {
      case 'buy':
        return {
          label: 'For Sale',
          variant: 'default' as const,
          icon: ShoppingCart,
          className: 'bg-green-100 text-green-800 hover:bg-green-200'
        };
      case 'sell':
        return {
          label: 'Selling',
          variant: 'secondary' as const,
          icon: Home,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        };
      case 'rent':
        return {
          label: 'For Rent',
          variant: 'outline' as const,
          icon: Key,
          className: 'bg-orange-100 text-orange-800 hover:bg-orange-200'
        };
      default:
        return {
          label: type,
          variant: 'default' as const,
          icon: Home,
          className: ''
        };
    }
  };

  const config = getTransactionConfig(transactionType);
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}