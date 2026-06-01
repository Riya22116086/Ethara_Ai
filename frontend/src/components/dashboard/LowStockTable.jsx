import React from 'react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';

const TABLE_HEADERS = ['Product Name', 'SKU', 'Stock', 'Price'];

function formatPrice(price) {
  return typeof price === 'number'
    ? `$${price.toFixed(2)}`
    : price ?? '—';
}

export default function LowStockTable({ products = [] }) {
  const lowStock = products.filter((p) => (p.stock ?? 0) < 10);

  if (lowStock.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 px-6 py-10">
        <p className="text-sm text-slate-500">All products are well stocked.</p>
      </div>
    );
  }

  return (
    <Table headers={TABLE_HEADERS} emptyMessage="No low-stock products found.">
      {lowStock.map((product) => (
        <tr key={product.id ?? product.sku ?? product.name}>
          <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-200">
            {product.name ?? '—'}
          </td>
          <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-400">
            {product.sku ?? '—'}
          </td>
          <td className="whitespace-nowrap px-4 py-3">
            <Badge variant="danger">{product.stock ?? 0}</Badge>
          </td>
          <td className="whitespace-nowrap px-4 py-3 text-slate-300">
            {formatPrice(product.price)}
          </td>
        </tr>
      ))}
    </Table>
  );
}
