import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./features/public/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Workspace from "./features/user/Workspace";
import AdminDashboard from "./features/admin/Dashboard";
import AdminUsers from "./features/admin/Users";
import NotFound from "./pages/NotFound";
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/app/:rest*" component={Workspace} />
      <Route path="/app" component={Workspace} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster theme="system" position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
