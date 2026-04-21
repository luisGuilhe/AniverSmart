import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import Dashboard from '../screens/Dashboard';
import MeusContatos from '../screens/MeusContatos';
import Sincronizar from '../screens/Sincronizar';
import Perfil from '../screens/Perfil';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, [string, string]> = {
  Home:     ['home',   'home-outline'],
  Contacts: ['people', 'people-outline'],
  Sync:     ['sync',   'sync-outline'],
  Profile:  ['person', 'person-outline'],
};

export function RootNavigator() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          const [activeIcon, inactiveIcon] = TAB_ICONS[route.name] ?? ['ellipse', 'ellipse-outline'];
          return (
            <View style={{
              backgroundColor: focused ? colors.tabActiveBg : 'transparent',
              paddingHorizontal: 14,
              paddingVertical: 4,
              borderRadius: 8,
            }}>
              <Ionicons
                name={(focused ? activeIcon : inactiveIcon) as any}
                size={22}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home"     component={Dashboard}    options={{ title: 'Início' }} />
      <Tab.Screen name="Contacts" component={MeusContatos} options={{ title: 'Contatos' }} />
      <Tab.Screen name="Sync"     component={Sincronizar}  options={{ title: 'Sincronizar' }} />
      <Tab.Screen name="Profile"  component={Perfil}       options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
