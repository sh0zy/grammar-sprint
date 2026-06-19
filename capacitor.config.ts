import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.leopa.grammarsprint",
  appName: "文法スプリント",
  webDir: "dist",
  // 完全オフライン：ローカルの dist を表示（リモートサーバー指定なし）
  android: {
    backgroundColor: "#fafafa",
  },
};

export default config;
