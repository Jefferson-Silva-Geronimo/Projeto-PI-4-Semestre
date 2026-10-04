import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import AdminAgendaScreen from '../screens/AdminAgendaScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import AdminOrderDetailsScreen from '../screens/AdminOrderDetailsScreen';
import AdminOrdersScreen from '../screens/AdminOrdersScreen';
import AdminProductsScreen from '../screens/AdminProductsScreen';
import AdminServicesScreen from '../screens/AdminServicesScreen';
import CreateProductScreen from '../screens/CreateProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import ServiceFormScreen from '../screens/ServiceFormScreen';

import type {
  AdminStackParamList,
} from '../types/navigation';

const Stack =
  createNativeStackNavigator<AdminStackParamList>();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AdminHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
      <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
      <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
      <Stack.Screen name="AdminOrderDetails" component={AdminOrderDetailsScreen} />
      <Stack.Screen name="AdminServices" component={AdminServicesScreen} />
      <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
      <Stack.Screen name="AdminAgenda" component={AdminAgendaScreen} />
    </Stack.Navigator>
  );
}
