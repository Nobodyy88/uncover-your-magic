import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
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

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
