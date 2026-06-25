export default {
  expo: {
    name: "ProEstoque",
    slug: "proestoque",
    version: "1.0.0",
    android: {
      package: "com.luisflima.proestoque"
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333/api",
      eas: {
        projectId: "5815dc19-241d-4c6a-906b-74b97ecc37c6"
      }
    },
    plugins: [
      "expo-font",
      "expo-router"
    ]
  },
};