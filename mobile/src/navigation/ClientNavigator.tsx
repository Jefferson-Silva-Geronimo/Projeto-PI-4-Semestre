import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ClientHomeScreen from '../screens/ClientHomeScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

import type {
  ClientStackParamList,
} from '../types/navigation';

const Stack =
  createNativeStackNavigator<ClientStackParamList>();

export default function ClientNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ClientHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ClientHome"
        component={ClientHomeScreen}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
      />

      <Stack.Screen
        name="Cart"
        component={CartScreen}
      />

      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
      />

      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
      />

      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
      />
    </Stack.Navigator>
  );
}