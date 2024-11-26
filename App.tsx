import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

interface TabBarIconProps {
  color: string;
  focused: boolean;
  size: number;
}

const Tab = createMaterialTopTabNavigator<TabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4c669f',
          tabBarInactiveTintColor: 'gray',
          tabBarShowIcon: true,
          tabBarStyle: { paddingTop: 30 }
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'בית',
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialCommunityIcons name="home" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'פרופיל',
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialCommunityIcons name="account" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'הגדרות',
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialCommunityIcons name="cog" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
