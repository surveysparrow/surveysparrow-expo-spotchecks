import { NativeModules, Platform } from 'react-native';

let mod: any;

// Loads react-native-device-info once; null and silent when it is not installed.
export const getDeviceInfo = (): any => {
  if (mod !== undefined) return mod;
  mod = null;
  // Same check as the library; on web it ships its own JS version.
  if (!NativeModules.RNDeviceInfo && Platform.OS !== 'web') return mod;
  // The require must sit directly in try, so Metro treats the package as optional.
  try {
    mod = require('react-native-device-info').default || null;
  } catch {
    mod = null;
  }
  return mod;
};
