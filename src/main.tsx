import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { MissionControlDashboard } from "@/pages/MissionControlDashboard";
import { AgentObservatoryPage } from "@/pages/AgentObservatoryPage";
import { LiveAnalyticsPage } from "@/pages/LiveAnalyticsPage";
import { ConfigurationPage } from "@/pages/ConfigurationPage";
import { Toaster } from "@/components/ui/sonner";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <MissionControlDashboard />,
      },
      {
        path: "agents",
        element: <AgentObservatoryPage />,
      },
      {
        path: "analytics",
        element: <LiveAnalyticsPage />,
      },
      {
        path: "configuration",
        element: <ConfigurationPage />,
      },
    ]
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster theme="dark" position="bottom-right" />
    </ErrorBoundary>
  </StrictMode>,
)