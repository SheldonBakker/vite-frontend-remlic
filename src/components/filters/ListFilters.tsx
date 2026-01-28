import type { SortOrder } from '@/api/types/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

export interface SortOption {
  value: string;
  label: string;
}

export interface ActiveFilter {
  label: string;
  value: string;
}

interface ListFiltersProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string)=> void;
  onSearchSubmit: ()=> void;
  onSearchClear: ()=> void;
  sortByValue: string | null;
  sortOptions: SortOption[];
  onSortByChange: (value: string | null)=> void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder)=> void;
  activeFilters: ActiveFilter[];
  onClearAllFilters: ()=> void;
  additionalFilters?: React.ReactNode;
}

export function ListFilters({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  sortByValue,
  sortOptions,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  activeFilters,
  onClearAllFilters,
  additionalFilters,
}: ListFiltersProps): React.JSX.Element {
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  const handleSortByChange = (value: string): void => {
    onSortByChange(value === 'none' ? null : value);
  };

  const handleSortOrderChange = (value: string): void => {
    onSortOrderChange(value as SortOrder);
  };

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-9"
          />
          {searchValue && (
            <button
              type="button"
              onClick={onSearchClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {additionalFilters}

        <Select value={sortByValue ?? 'none'} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Default</SelectItem>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {sortByValue && (
          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Button onClick={onSearchSubmit} variant="secondary">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <span key={index} className="text-sm bg-secondary px-2 py-1 rounded">
              {filter.label}: {filter.value}
            </span>
          ))}
          <Button variant="ghost" size="sm" onClick={onClearAllFilters}>
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
