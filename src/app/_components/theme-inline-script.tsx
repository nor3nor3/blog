import { NoFOUCScript, STORAGE_KEY } from "./theme-script";

export function ThemeInlineScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(${NoFOUCScript.toString()})('${STORAGE_KEY}')`,
      }}
    />
  );
}
