import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/auth/AuthProvider';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { ChatProvider } from './context/ChatProvider';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  const [user, setUser] = useState(null);

  const paypalOptions = {
    "client-id": "AfdJGHP0Txsmtf6sieQ5aBqXslWOBSv6EbBOUUr358_qTh-8B0DqZWO6_voozLKCds3ZLatjnZDaodX8",
    currency: "USD",
    intent: "capture",
    "disable-funding": "credit,card",
    "enable-funding": "paypal",
    components: "buttons",
    debug: false,
    "data-csp-nonce": "xyz123",
    "data-page-type": "checkout",
    "data-partner-attribution-id": "WORKFINDER_SP",
    "data-logging-level": "error",
    "data-sdk-integration-source": "WORKFINDER_PAYPAL_JS_SDK"
  };

  return (
    <PayPalScriptProvider 
      options={paypalOptions}
      scriptLoadingState={{ isLoading: true }}
      deferLoading={true}
    >
      <ChatProvider>
        <AuthProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <AppRoutes user={user} setUser={setUser} />
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </ChatProvider>
    </PayPalScriptProvider>
  );
}

export default App;
