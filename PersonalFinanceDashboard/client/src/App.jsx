import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth.jsx";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page.jsx";
import HomePage from "@/pages/home-page";
import TransactionsPage from "@/pages/transactions-page";
import BudgetGoalsPage from "@/pages/budget-goals-page";
import { ProtectedRoute } from "./lib/protected-route.jsx";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/transactions" component={TransactionsPage} />
      <ProtectedRoute path="/budget-goals" component={BudgetGoalsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;