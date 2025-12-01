import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BannerSlider from './src/components/BannerSlider';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/navigation/StackNavigation';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
          <StackNavigation/>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
