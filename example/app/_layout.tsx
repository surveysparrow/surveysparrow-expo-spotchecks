import { Stack } from "expo-router";
import { useLayoutEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initializeSpotChecks } from "surveysparrow-expo-spotchecks";
import SpotCheck from "surveysparrow-expo-spotchecks";
import type { SsSpotcheckListener } from "surveysparrow-expo-spotchecks";

const listener: SsSpotcheckListener = {
  onSurveyLoaded: async (response: Record<string, any>) => {
    console.log('Survey Loaded', response);
  },
  onSurveyResponse: async (response: Record<string, any>) => {
    console.log('Survey Response', response);
  },
  onPartialSubmission: async (response: Record<string, any>) => {
    console.log('Partial Submission', response);
  },
  onCloseButtonTap: async () => {
    console.log('Close Button Tapped');
  },
};
export default function RootLayout() {
  useLayoutEffect(() => {
    initializeSpotChecks({
      domainName: "",
      targetToken: "",
      userDetails: {
        email: "your-email@example.com"
      },
      listener,
    });
  }, []);
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Home Screen" }} />
        <Stack.Screen name="profile" options={{ title: "Profile Screen" }} />
        <Stack.Screen name="settings" options={{ title: "Settings Screen" }} />
      </Stack>
      <SpotCheck />
    </SafeAreaProvider>
  );
}
