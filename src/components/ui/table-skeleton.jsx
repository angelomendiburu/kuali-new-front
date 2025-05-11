import React from 'react';

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search and filter skeleton */}
      <div className="flex items-center justify-between">
        <div className="w-64 h-10 bg-muted animate-pulse rounded-md"></div>
        <div className="w-36 h-10 bg-muted animate-pulse rounded-md"></div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <div className="bg-card">
          {/* Header */}
          <div className="grid grid-cols-6 border-b">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
              </div>
            ))}
          </div>
          
          {/* Rows */}
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-6 border-b">
              {[...Array(6)].map((_, colIndex) => (
                <div key={colIndex} className="p-4">
                  <div 
                    className="h-4 bg-muted animate-pulse rounded"
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                  ></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <div className="w-48 h-4 bg-muted animate-pulse rounded"></div>
        <div className="flex gap-2">
          <div className="w-24 h-8 bg-muted animate-pulse rounded"></div>
          <div className="w-24 h-8 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default TableSkeleton;