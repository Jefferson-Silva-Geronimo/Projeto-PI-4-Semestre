import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClientHomeScreen from '../screens/ClientHomeScreen';
import type { ClientStackParamList } from '../types/navigation';

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
    </Stack.Navigator>
  );
}