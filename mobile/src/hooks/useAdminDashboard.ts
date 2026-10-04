import {
  useCallback,
  useState,
} from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { appointmentService } from '../services/appointment.service';
import { orderService } from '../services/order.service';
import { productService } from '../services/product.service';

import { toDateKey } from '../utils/date';

const LOW_STOCK_LIMIT = 5;

interface DashboardIndicators {
  pendingOrders: number;
  todayAppointments: number;
  lowStockProducts: number;
}

export function useAdminDashboard() {
  const [indicators, setIndicators] =
    useState<DashboardIndicators | null>(null);

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        orderService.listForAdmin({
          pageSize: 1,
          status: 'CONFIRMED',
        }),
        appointmentService.listAgenda(toDateKey(new Date())),
        productService.listAll({
          pageSize: 1,
          active: true,
          maxStock: LOW_STOCK_LIMIT,
        }),
      ])
        .then(([orders, agenda, products]) =>
          setIndicators({
            pendingOrders: orders.pagination.totalItems,
            todayAppointments: agenda.filter(
              (item) => item.status !== 'CANCELLED',
            ).length,
            lowStockProducts: products.pagination.totalItems,
          }),
        )
        .catch(() => setIndicators(null));
    }, []),
  );

  return indicators;
}
