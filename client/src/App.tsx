import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import BodyMetrics from "./pages/BodyMetrics";
import BodyMetricsAdd from "./pages/BodyMetricsAdd";
import BodyMetricsImportCSV from "./pages/BodyMetricsImportCSV";
import BodyPhotosGallery from "./pages/BodyPhotosGallery";
import FoodLog from "./pages/FoodLog";
import ExerciseLog from "./pages/ExerciseLog";
import Settings from "./pages/Settings";
import SharePermissions from "./pages/SharePermissions";
import InviteCoach from "./pages/InviteCoach";
import InviteFriend from "./pages/InviteFriend";
import Onboarding from "./pages/Onboarding";
import AdminProducts from "./pages/AdminProducts";
import BodyReportImport from "./pages/BodyReportImport";
import AppLayout from "./components/AppLayout";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/onboarding"}>
        <AppLayout>
          <Onboarding />
        </AppLayout>
      </Route>
      <Route path={"/dashboard"}>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </Route>
      <Route path={"/body"}>
        <AppLayout>
          <BodyMetrics />
        </AppLayout>
      </Route>
      <Route path={"/body/add"}>
        <AppLayout>
          <BodyMetricsAdd />
        </AppLayout>
      </Route>
      <Route path={"/body/import-csv"}>
        <AppLayout>
          <BodyMetricsImportCSV />
        </AppLayout>
      </Route>
      <Route path={"/body/photos"}>
        <AppLayout>
          <BodyPhotosGallery />
        </AppLayout>
      </Route>
      <Route path={"/body/import/photo"}>
        <AppLayout>
          <BodyReportImport />
        </AppLayout>
      </Route>
      <Route path={"/food"}>
        <AppLayout>
          <FoodLog />
        </AppLayout>
      </Route>
      <Route path={"/food/:date"}>
        {() => (
          <AppLayout>
            <FoodLog />
          </AppLayout>
        )}
      </Route>
      <Route path={"/exercise"}>
        <AppLayout>
          <ExerciseLog />
        </AppLayout>
      </Route>
      <Route path={"/settings"}>
        <AppLayout>
          <Settings />
        </AppLayout>
      </Route>
      <Route path={"/share-permissions"}>
        <AppLayout>
          <SharePermissions />
        </AppLayout>
      </Route>
      <Route path={"/invite-coach"}>
        <AppLayout>
          <InviteCoach />
        </AppLayout>
      </Route>
      <Route path={"/invite-friend"}>
        <AppLayout>
          <InviteFriend />
        </AppLayout>
      </Route>
      <Route path={"/admin/products"}>
        <AppLayout>
          <AdminProducts />
        </AppLayout>
      </Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
