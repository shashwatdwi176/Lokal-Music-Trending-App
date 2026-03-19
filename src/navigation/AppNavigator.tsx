import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PlayerScreen from '../screens/PlayerScreen';
import QueueScreen from '../screens/QueueScreen';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayerStore } from '../store/playerStore';

export type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  Queue: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const [currentRoute, setCurrentRoute] = React.useState<string | undefined>(undefined);

  return (
    <NavigationContainer
      onStateChange={(state: any) => {
        const route = state?.routes[state.index];
        setCurrentRoute(route?.name);
      }}
    >
      <View style={styles.root}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: ({ current, layouts }: { current: any; layouts: any }) => ({
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            }),
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Player"
            component={PlayerScreen}
            options={{
              gestureEnabled: true,
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="Queue"
            component={QueueScreen}
            options={{
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>

        {/* MiniPlayer is visible when a track is loaded, except on Player and Queue screens */}
        {currentTrack && currentRoute !== 'Player' && currentRoute !== 'Queue' && <MiniPlayer />}
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#121212',
  },
});

export default AppNavigator;
