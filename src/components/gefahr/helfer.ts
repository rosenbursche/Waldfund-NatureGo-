import * as Haptics from 'expo-haptics';
import { Easing, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

/** Vibration, falls das Handy sie kann */
export function ruck(stark: boolean) {
  Haptics.impactAsync(stark ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** sanftes Auf und Ab, z. B. für den schwebenden Totenkopf */
export function schweben(weite: number, dauer: number) {
  return withRepeat(
    withSequence(
      withTiming(-weite, { duration: dauer, easing: Easing.inOut(Easing.sin) }),
      withTiming(weite, { duration: dauer, easing: Easing.inOut(Easing.sin) }),
    ),
    -1,
    true,
  );
}
