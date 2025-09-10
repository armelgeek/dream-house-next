import React from 'react';
import { Grid, List, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';

export type ViewMode = 'grid' | 'list' | 'map';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewChange,
  className,
}) => {
  const views = [
    { mode: 'grid' as ViewMode, icon: Grid, label: 'Grid' },
    { mode: 'list' as ViewMode, icon: List, label: 'List' },
    { mode: 'map' as ViewMode, icon: Map, label: 'Map' },
  ];

  return (
    <div className={cn('flex items-center border border-gray-200 rounded-md', className)}>
      {views.map(({ mode, icon: Icon, label }) => (
        <Button
          key={mode}
          variant="ghost"
          size="sm"
          onClick={() => onViewChange(mode)}
          className={cn(
            'rounded-none border-r border-gray-200 last:border-r-0 px-3 py-2',
            viewMode === mode && 'bg-gray-100 text-gray-900'
          )}
          title={`${label} view`}
        >
          <Icon className="w-4 h-4" />
          <span className="ml-1 hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
};