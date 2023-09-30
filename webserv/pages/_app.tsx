import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );
          })
          .catch((error) => {
            console.error("Service Worker registration failed: ", error);
          });
      });
    }
  }, []);
  return <Component {...pageProps} />;
}
