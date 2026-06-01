import React from 'react';

function EmptyState({ message }) {
  return (
    <tr>
      <td colSpan={999}>
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 opacity-40"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
          <span className="text-sm">{message}</span>
        </div>
      </td>
    </tr>
  );
}

export default function Table({
  headers = [],
  children,
  emptyMessage = 'No data available.',
}) {
  const isEmpty =
    !children ||
    (Array.isArray(children) && children.length === 0) ||
    children === null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="min-w-full table-auto text-sm">
        <thead className="border-b border-slate-800 bg-slate-900/60">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {isEmpty ? (
            <EmptyState message={emptyMessage} />
          ) : (
            React.Children.map(children, (child) =>
              React.cloneElement(child, {
                className: `hover:bg-slate-800/20 transition-colors ${child.props.className ?? ''}`,
              })
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
