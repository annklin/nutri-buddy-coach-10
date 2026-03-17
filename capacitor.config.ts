import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rabbitnutri.buddy",
  appName: "Rabbit",
  webDir: "dist",
  bundledWebRuntime: false
  android: {
    minSdkVersion: 24
  }
};

export default config;
