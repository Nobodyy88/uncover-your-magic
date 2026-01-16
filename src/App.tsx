import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import About from "./pages/About";
import PartnerNetwork from "./pages/PartnerNetwork";
import NotFound from "./pages/NotFound";

// Products
import Tires from "./pages/products/Tires";
import Rims from "./pages/products/Rims";
import Regeneration from "./pages/products/Regeneration";
import RideOn from "./pages/products/RideOn";

// Service
import Repairs from "./pages/service/Repairs";
import ServiceContract from "./pages/service/ServiceContract";
import Mounting from "./pages/service/Mounting";

// Admin
import Login from "./pages/admin/Login";
import ResetPassword from "./pages/admin/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import PageEditor from "./pages/admin/PageEditor";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/o-nas" element={<About />} />
            <Route path="/siec-partnerow" element={<PartnerNetwork />} />

            {/* Products */}
            <Route path="/produkty/opony" element={<Tires />} />
            <Route path="/produkty/felgi" element={<Rims />} />
            <Route path="/produkty/regeneracja" element={<Regeneration />} />
            <Route path="/produkty/ride-on" element={<RideOn />} />

            {/* Service */}
            <Route path="/serwis/naprawy" element={<Repairs />} />
            <Route path="/serwis/umowa-serwisowa" element={<ServiceContract />} />
            <Route path="/serwis/montaz" element={<Mounting />} />

            {/* Admin */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/page/:pageId"
              element={
                <ProtectedRoute>
                  <PageEditor />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
