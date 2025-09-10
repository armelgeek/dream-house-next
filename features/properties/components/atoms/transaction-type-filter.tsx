import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { TransactionType } from '../../config/property.schema';

interface TransactionTypeFilterProps {
  selectedTransactionType?: TransactionType;
  onTransactionTypeChange: (transactionType?: TransactionType) => void;
  className?: string;
}

export const TransactionTypeFilter: React.FC<TransactionTypeFilterProps> = ({
  selectedTransactionType,
  onTransactionTypeChange,
  className
}) => {
  const transactionTypes = [
    { value: 'buy' as const, label: 'Buy', emoji: '🏠' },
    { value: 'sell' as const, label: 'Sell', emoji: '💰' },
    { value: 'rent' as const, label: 'Rent', emoji: '🔑' },
  ];

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Button
        variant={!selectedTransactionType ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTransactionTypeChange(undefined)}
        className="flex items-center gap-2"
      >
        All Types
      </Button>
      
      {transactionTypes.map((type) => (
        <Button
          key={type.value}
          variant={selectedTransactionType === type.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTransactionTypeChange(type.value)}
          className="flex items-center gap-2"
        >
          <span>{type.emoji}</span>
          {type.label}
        </Button>
      ))}
    </div>
  );
};