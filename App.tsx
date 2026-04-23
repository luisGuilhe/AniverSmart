import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={ebStyles.container}>
          <Text style={ebStyles.title}>Algo deu errado</Text>
          <Text style={ebStyles.message}>
            {this.state.error?.message ?? 'Erro desconhecido. Tente reiniciar o aplicativo.'}
          </Text>
          <TouchableOpacity
            style={ebStyles.btn}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={ebStyles.btnText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const ebStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8, color: '#1a1a1a' },
  message: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  btn: { backgroundColor: '#006948', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

function AppInner() {
  const { isDark } = useThemeContext();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <NavigationContainer>
              <AppProvider>
                <AppInner />
              </AppProvider>
            </NavigationContainer>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
