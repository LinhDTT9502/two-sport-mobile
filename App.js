import MainContainer from "./src/navigations/index"
import { Provider } from "react-redux";
import { store, persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from 'react-native';

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <NavigationContainer>
    <Provider store={store}>
    <PersistGate persistor={persistor} >
  <MainContainer/>
  </PersistGate>
  </Provider>
  </NavigationContainer>
  );
}
LogBox.ignoreAllLogs(true);
