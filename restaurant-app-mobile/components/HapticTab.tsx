import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface HapticTabProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export function HapticTab({ onPressIn, ...props }: HapticTabProps) {
  return (
    <TouchableOpacity
      {...props}
      onPressIn={(ev) => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(ev);
      }}
    />
  );
}
