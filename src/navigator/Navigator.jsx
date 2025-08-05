import { createStackNavigator } from "@react-navigation/stack";
//screens
import Home from "../screens/Home";
import SubjectScreen from "../screens/Calender";
//stack navigator
const Stack = createStackNavigator();
const Navigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Subject" component={SubjectScreen} />
        </Stack.Navigator>
    );
};
export default Navigator;