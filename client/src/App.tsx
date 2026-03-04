import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AddPersona from "./pages/AddPersona";
import Dashboard from "./pages/Dashboard";
import SubmitTest from "./pages/SubmitTest";
import TestResults from "./pages/TestResults";
import SkillsManagement from "./pages/SkillsManagement";
import ExportReport from "./pages/ExportReport";
import TestFlow from "./pages/TestFlow";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">A carregar...</p>
        </div>
      </div>
    );
  }

  // Permitir acesso sem autenticação para desenvolvimento
  // Em produção, remova este comentário para exigir autenticação
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/submit" component={SubmitTest} />
      <Route path="/test-flow" component={TestFlow} />
      <Route path="/test/:id" component={TestResults} />
      <Route path="/add-persona" component={AddPersona} />
      <Route path="/skills" component={SkillsManagement} />
      <Route path="/export/:id" component={ExportReport} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );

  // Código original com autenticação obrigatória (comentado):
  // if (!user) {
  //   return (
  //     <Switch>
  //       <Route path="/" component={Dashboard} />
  //       <Route component={NotFound} />
  //     </Switch>
  //   );
  // }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
