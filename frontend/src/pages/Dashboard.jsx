import { useEffect } from 'react';
import useProducts from '../hooks/useProducts';
import useCustomers from '../hooks/useCustomers';
import useOrders from '../hooks/useOrders';
import MetricCard from '../components/dashboard/MetricCard';
import LowStockTable from '../components/dashboard/LowStockTable';
import Spinner from '../components/ui/Spinner';

const PackageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const Dashboard = () => {
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { customers, loading: customersLoading, fetchCustomers } = useCustomers();
  const { orders, loading: ordersLoading, fetchOrders } = useOrders();

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchOrders();
  }, []);

  const isLoading = productsLoading || customersLoading || ordersLoading;
  const lowStockItems = products.filter((p) => p.stock < 10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome back. Here is what is happening today.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Products"
            value={products.length}
            colorClass="blue"
            icon={<PackageIcon />}
          />
          <MetricCard
            title="Total Customers"
            value={customers.length}
            colorClass="green"
            icon={<UsersIcon />}
          />
          <MetricCard
            title="Total Orders"
            value={orders.length}
            colorClass="purple"
            icon={<ShoppingCartIcon />}
          />
          <MetricCard
            title="Low Stock"
            value={lowStockItems.length}
            colorClass="red"
            icon={<AlertTriangleIcon />}
          />
        </div>

        {/* Low Stock Alerts Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Low Stock Alerts</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
              {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} need attention
            </span>
          </div>
          <LowStockTable products={lowStockItems} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;