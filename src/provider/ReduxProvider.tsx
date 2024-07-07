"use client";
import { persistor, store } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import AuthProvider from "./AuthProvider";

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  ////----important(TO PREVENT HYDRATION ERROR)
  const [isRendering, setIsRendering] = useState<boolean>(false);
  useEffect(() => {
    setIsRendering(true);
  }, []);
  if (!isRendering) {
    return "";
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster position="top-center" richColors={true} />
        <AuthProvider>{children}</AuthProvider>
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
