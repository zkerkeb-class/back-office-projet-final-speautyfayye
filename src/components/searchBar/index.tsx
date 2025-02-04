'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

interface SearchBarProps {
  placeholder: string;
  onSearch: (searchTerm: string) => void;
}

const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  return (
    <div className="relative mb-4 w-full max-w-sm">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default SearchBar; 