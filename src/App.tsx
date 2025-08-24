import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CollectionsPage from "./pages/CollectionsPage";
import VaultPage from "./pages/VaultPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Layout with Header */}
          <Route path="/" element={<Index />}>
            <Route index element={<HomePage onPageChange={function (page: "search" | "collections" | "vault"): void {
              throw new Error("Function not implemented.");
            } } refreshTrigger={0} />} />
            <Route path="search" element={<SearchPage onItemAdded={function (): void {
              throw new Error("Function not implemented.");
            } } />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="vault" element={<VaultPage refreshTrigger={0} />} />
          </Route>

          {/* Catch-all for invalid routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
