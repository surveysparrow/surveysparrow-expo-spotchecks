import { Platform, Settings } from 'react-native';
import { requireOptionalNativeModule } from 'expo-modules-core';
import uuid from 'react-native-uuid';
import { captureP1Error } from './sentry';

const UUID_KEY = 'SurveySparrowUUID';

// Legacy SDK stores: Android default SharedPreferences, iOS UserDefaults (RN Settings).
const androidStore: any = Platform.OS === 'android' ? requireOptionalNativeModule('SpotchecksStorage') : null;

const readLegacyStore = (): string | null => {
  if (Platform.OS === 'ios') return Settings.get(UUID_KEY) ?? null;
  return androidStore?.getString(UUID_KEY) ?? null;
};

const writeLegacyStore = (value: string) => {
  if (Platform.OS === 'ios') Settings.set({ [UUID_KEY]: value });
  else androidStore?.putString(UUID_KEY, value);
};

// Earlier revamp betas used expo-secure-store; copy that value over once.
const readSecureStore = async (): Promise<string | null> => {
  try {
    const SecureStore = require('expo-secure-store');
    return await SecureStore.getItemAsync(UUID_KEY);
  } catch {
    return null;
  }
};

// Android fallback when the native module is missing (Expo Go, OTA on older binary).
const useSecureStoreFallback = Platform.OS === 'android' && !androidStore;

const writeSecureStore = async (value: string) => {
  try {
    const SecureStore = require('expo-secure-store');
    await SecureStore.setItemAsync(UUID_KEY, value);
  } catch {
    // expo-secure-store not installed; nothing to persist to.
  }
};

const generateTraceId = () => {
  const uuidString = uuid.v4();
  const timestamp = Date.now();
  return `${uuidString}-${timestamp}`;
};

export const saveData = async (value: string) => {
  try {
    if (useSecureStoreFallback) await writeSecureStore(value);
    else writeLegacyStore(value);
  } catch (error: any) {
    captureP1Error(error, 'GENERAL', {
      action: 'saveData',
      errorMessage: error?.message,
    });
  }
};

export const loadData = async (isuuid: boolean = false) => {
  try {
    if (isuuid) {
      return generateTraceId();
    }
    const stored = readLegacyStore();
    if (stored) return stored;
    const migrated = await readSecureStore();
    if (migrated && !useSecureStoreFallback) writeLegacyStore(migrated);
    return migrated;
  } catch (error: any) {
    captureP1Error(error, 'GENERAL', {
      action: 'loadData',
      isuuid,
      errorMessage: error?.message,
    });
    return null;
  }
};
