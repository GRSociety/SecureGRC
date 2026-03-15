import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GRCProvider } from "@/contexts/GRCContext";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Framework from "@/pages/Framework";
import Assets from "@/pages/Assets";
import RisksOverview from "@/pages/RisksOverview";
import AssetRisk from "@/pages/AssetRisk";
import Compliance from "@/pages/Compliance";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GRCProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/framework" element={<Framework />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/risks" element={<RisksOverview />} />
              <Route path="/risks/assets" element={<AssetRisk />} />
              <Route path="/compliance" element={<Compliance />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GRCProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
