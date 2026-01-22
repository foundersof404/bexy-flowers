import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  ArrowLeft,
  Users,
  Package,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getCheckoutOrders } from '@/lib/api/checkout';
import type { CartItem } from '@/types/cart';

const GOLD_COLOR = 'rgb(199, 158, 72)';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function orderItemsSummary(items: CartItem[]): string {
  if (!Array.isArray(items) || items.length === 0) return '—';
  const total = items.reduce((s, i) => s + (i.quantity ?? 1), 0);
  return items.length === 1 && total === 1
    ? '1 item'
    : `${items.length} items (${total} total)`;
}

const AdminClients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['checkout-orders'],
    queryFn: getCheckoutOrders,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const hasToastedErrorRef = useRef(false);
  useEffect(() => {
    if (!isError) {
      hasToastedErrorRef.current = false;
      return;
    }
    if (hasToastedErrorRef.current) return;
    hasToastedErrorRef.current = true;
    toast({
      title: 'Error loading orders',
      description: error instanceof Error ? error.message : 'Failed to fetch client orders.',
      variant: 'destructive',
    });
  }, [isError, error, toast]);

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full max-w-[1920px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="mb-2 -ml-2 text-gray-600 hover:text-gray-900"
                onClick={() => navigate('/admin/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-8 h-8" style={{ color: GOLD_COLOR }} />
                Clients & Orders
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Customer checkout information and order history
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="self-start sm:self-center"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" style={{ color: GOLD_COLOR }}>
                  {orders.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" style={{ color: GOLD_COLOR }}>
                  ${orders.reduce((s, o) => s + Number(o.total || 0), 0).toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Unique customers (email)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" style={{ color: GOLD_COLOR }}>
                  {new Set(orders.map((o) => (o.email || '').toLowerCase()).filter(Boolean)).size}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Orders table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  All checkout orders with contact and delivery details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No orders yet.</p>
                    <p className="text-sm mt-1">Orders will appear here when customers complete checkout.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10" />
                          <TableHead>Date</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                          <TableHead className="text-right">Delivery</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <React.Fragment key={order.id}>
                            <TableRow
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() =>
                                setExpandedId((id) => (id === order.id ? null : order.id))
                              }
                            >
                              <TableCell>
                                {expandedId === order.id ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-sm text-gray-600">
                                {formatDate(order.created_at)}
                              </TableCell>
                              <TableCell className="font-medium">{order.full_name}</TableCell>
                              <TableCell className="text-sm">
                                <a
                                  href={`tel:${order.phone}`}
                                  className="text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {order.phone}
                                </a>
                              </TableCell>
                              <TableCell className="text-sm">
                                <a
                                  href={`mailto:${order.email}`}
                                  className="text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {order.email}
                                </a>
                              </TableCell>
                              <TableCell className="max-w-[180px] truncate text-sm text-gray-600" title={order.location}>
                                {order.location}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {orderItemsSummary(order.order_items)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${Number(order.subtotal || 0).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right text-gray-600">
                                ${Number(order.delivery_fee || 0).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right font-bold" style={{ color: GOLD_COLOR }}>
                                ${Number(order.total || 0).toFixed(2)}
                              </TableCell>
                            </TableRow>
                            {expandedId === order.id && (
                              <TableRow className="bg-gray-50/80">
                                <TableCell colSpan={10} className="p-4">
                                  <OrderItemsDetail items={order.order_items} />
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

function OrderItemsDetail({ items }: { items: CartItem[] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-sm text-gray-500">No items.</p>;
  }
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 mb-2">Order details</p>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li
            key={`${item.id}-${item.size ?? ''}-${idx}`}
            className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0"
          >
            {item.image && (
              <img
                src={item.image}
                alt=""
                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.title}</p>
              {item.size && (
                <p className="text-xs text-gray-500">Size: {item.size}</p>
              )}
              {item.personalNote && (
                <p className="text-xs text-gray-600 mt-0.5">Note: {item.personalNote}</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-medium">${Number(item.price || 0).toFixed(2)}</p>
              <p className="text-xs text-gray-500">× {item.quantity ?? 1}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminClients;
