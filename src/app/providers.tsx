"use client";


import React, { createContext, useContext, useState } from 'react';
import NotificationToaster from '@/components/NotificationToaster';
// Notification Context
type Notification = { type: string; message: string };
type NotificationContextType = {
  notify: (type: string, message: string) => void;
};
const NotificationContext = createContext<NotificationContextType>({ notify: () => {} });

export function useNotification() {
  return useContext(NotificationContext);
}

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  function notify(type: string, message: string) {
    setNotifications((prev) => [...prev, { type, message }]);
    setTimeout(() => setNotifications((prev) => prev.slice(1)), 4000);
  }
  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <NotificationToaster notifications={notifications} />
    </NotificationContext.Provider>
  );
}
import { WagmiConfig, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const config = createConfig({
  autoConnect: true,
  publicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </WagmiConfig>
  );
}

export default Providers;
