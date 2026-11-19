# surveysparrow-expo-spotchecks

Spotchecks enables you to collect feedback from your mobile app. Embed the Classic, Chat & NPS surveys in your React Native application seamlessly with few lines of code.

## Install

```sh
npx expo install surveysparrow-expo-spotchecks react-native-webview react-native-svg react-native-safe-area-context axios
```

Peer dependencies: `react-native-webview` 13.0.0+, `react-native-svg` 15.0.0+, `react-native-safe-area-context` 4.0.0+, `axios` 0.21.0+. Optional: `react-native-device-info` 8.7.0+, `expo-blur` (backdrop blur on iOS), `@sentry/react-native` (SDK error reporting), `expo-secure-store` 13.0.0+.

Needs a development build (`npx expo run:ios` / `npx expo run:android` or EAS); it does not run in Expo Go. Android `minSdkVersion` 24 or higher; Android System WebView 80 or newer on the device.

## Usage

Initialize once with `initializeSpotChecks`, mount the `Spotcheck` component in your root layout, then call `trackScreen` and `trackEvent` from your screens.

Full guide: [developers.surveysparrow.com/spotchecks/mobile-spotchecks/react-native](https://developers.surveysparrow.com/spotchecks/mobile-spotchecks/react-native) (Expo tab).

Report bugs and feature requests on [GitHub Issues](https://github.com/surveysparrow/surveysparrow-react-native-sdk/issues).
