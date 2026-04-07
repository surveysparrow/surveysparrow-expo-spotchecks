import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  initializeSpotChecks,
  trackScreen,
  trackEvent,
} from "surveysparrow-expo-spotchecks";




export default function Index() {
  const router = useRouter();


  useEffect(() => {
    const variables = {
      sparrowLang: 'en',
      'test-variable': '****test-VALUE****',
    };
    const customProperties = {};
    const userDetails = {
      email: 'gokul@gmail.com',
    };


    setTimeout(() => {
    trackScreen('ProfileScreen', {
      variables,
        customProperties,
        userDetails,
      });

    }, 0);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Home Screen</Text>
        <View>
          <TouchableOpacity onPress={() => router.navigate("profile" as any)}>
            <Text style={styles.buttonText}>Profile Screen</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.navigate("settings" as any)}>
            <Text style={styles.buttonText}>Settings Screen</Text>
          </TouchableOpacity>
        </View>
        <View></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "blue",
    marginVertical: 10,
  },
});
