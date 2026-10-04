import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import AppointmentsScreen from '../screens/AppointmentsScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ClientHomeScreen from '../screens/ClientHomeScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import PetFormScreen from '../screens/PetFormScreen';
import PetsScreen from '../screens/PetsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ServicesScreen from '../screens/ServicesScreen';

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

      <Stack.Screen
        name="Pets"
        component={PetsScreen}
      />

      <Stack.Screen
        name="PetForm"
        component={PetFormScreen}
      />

      <Stack.Screen
        name="Services"
        component={ServicesScreen}
      />

      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
      />

      <Stack.Screen
        name="Appointments"
        component={AppointmentsScreen}
      />
    </Stack.Navigator>
  );
}