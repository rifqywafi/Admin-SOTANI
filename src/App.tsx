import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./layouts/ProtectedRoute";
import DashboardLayout from "./layouts/MainLayout";

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Sawit = lazy(() => import("./pages/Sawit"));
// const Analytics = lazy(() => import("./pages/Analytics"));
// const Settings = lazy(() => import("./pages/Settings"));

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sawit" element={<Sawit />} />
            {/* <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} /> */}
          </Route>
        </Route>

        {/* 404 bisa ditaruh di luar */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Suspense>
  );
}
