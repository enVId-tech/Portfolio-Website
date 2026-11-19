import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@next/next/no-img-element": "off",
      // New in eslint-plugin-react-hooks 7. The fetch-on-mount and hydration effects flagged by this rule work as
      // written, so report them as warnings until they are moved to SWR / useSyncExternalStore.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override the default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
