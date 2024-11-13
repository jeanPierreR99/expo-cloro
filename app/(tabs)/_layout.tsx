import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Tabs, Stack } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 16,
        },
        tabBarStyle: {
          height: 60,
        },
        tabBarActiveTintColor: "red",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={"red"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "person-circle-sharp" : "person-circle-outline"}
              color={"red"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          // tabBarLabelStyle: {
          //   fontSize: 18,
          // },
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "time" : "time-outline"}
              color={"red"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
