import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminHomeScreen from '../screens/AdminHomeScreen';
import AdminProductsScreen from '../screens/AdminProductsScreen';
import CreateProductScreen from '../screens/CreateProductScreen';

import type { AdminStackParamList } from '../types/navigation';

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
      <Stack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
      />

      <Stack.Screen
        name="AdminProducts"
        component={AdminProductsScreen}
      />

      <Stack.Screen
        name="CreateProduct"
        component={CreateProductScreen}
      />
    </Stack.Navigator>
  );
}