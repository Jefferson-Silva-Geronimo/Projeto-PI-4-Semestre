import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import AppointmentsScreen from '../screens/AppointmentsScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import { withBottomMenu } from '../components/withBottomMenu';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ClientHomeScreen from '../screens/ClientHomeScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import PetFormScreen from '../screens/PetFormScreen';
import PetsScreen from '../screens/PetsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ServicesScreen from '../screens/ServicesScreen';

import type {
  ClientStackParamList,
} from '../types/navigation';

const Stack =
  createNativeStackNavigator<ClientStackParamList>();

const HomeWithMenu = withBottomMenu(ClientHomeScreen, 'ClientHome');
const ServicesWithMenu = withBottomMenu(ServicesScreen, 'Services');
const CartWithMenu = withBottomMenu(CartScreen, 'Cart');
const OrdersWithMenu = withBottomMenu(OrdersScreen, 'Orders');
const ProfileWithMenu = withBottomMenu(ProfileScreen, 'Profile');

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
        component={HomeWithMenu}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
      />

      <Stack.Screen
        name="Cart"
        component={CartWithMenu}
      />

      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
      />

      <Stack.Screen
        name="Orders"
        component={OrdersWithMenu}
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
        component={ServicesWithMenu}
      />

      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
      />

      <Stack.Screen
        name="Appointments"
        component={AppointmentsScreen}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileWithMenu}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
      />
    </Stack.Navigator>
  );
}