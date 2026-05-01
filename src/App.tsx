import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import Home from "./pages/Home";
import ModulePage from "./pages/ModulePage";
import QuizPage from "./pages/QuizPage";
import MegaQuizPage from "./pages/MegaQuizPage";
import HistoryPage from "./pages/HistoryPage";
import GlossaryPage from "./pages/GlossaryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * App.tsx — Roteamento principal.
 * Todas as rotas vivem dentro de <AppShell> para compartilharem
 * a barra lateral de navegação entre módulos.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/modulo/:slug" element={<ModulePage />} />
            <Route path="/modulo/:slug/quiz" element={<QuizPage />} />
            <Route path="/mega-quiz" element={<MegaQuizPage />} />
            <Route path="/historico" element={<HistoryPage />} />
            <Route path="/glossario" element={<GlossaryPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
