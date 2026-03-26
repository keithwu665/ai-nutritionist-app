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
import AIRecommendations from "./pages/AIRecommendations";
import MoodLog from "./pages/MoodLog";
import HomeRecipes from "./pages/HomeRecipes";
import ProteinSelection from "./pages/ProteinSelection";
import RecipeList from "./pages/RecipeList";
import RecipeMethodSelection from "./pages/RecipeMethodSelection";
import RecipePage from "./pages/RecipePage";
import AIRecommendedRecipes from "./pages/AIRecommendedRecipes";
import FitastyIntegration from "./pages/FitastyIntegration";
import { RecipeListPage } from "./pages/RecipeListPage";
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
      <Route path={"/diet/inspiration/home-cooking"}>
        <AppLayout>
          <HomeRecipes />
        </AppLayout>
      </Route>
      <Route path={"/diet/inspiration/home-cooking/:category"}>
        {({ category }) => (
          <AppLayout>
            <ProteinSelection category={category} />
          </AppLayout>
        )}
      </Route>
      <Route path={"\u002Fdiet\u002Finspiration\u002Fhome-cooking\u002F:category\u002F:protein"}>
        {() => (
          <AppLayout>
            <RecipeMethodSelection />
          </AppLayout>
        )}
      </Route>
      <Route path={"\u002Fdiet\u002Finspiration\u002Fhome-cooking\u002F:category\u002F:protein\u002Frecipes"}>
        {() => (
          <AppLayout>
            <RecipeListPage />
          </AppLayout>
        )}
      </Route>
      <Route path={"\u002Fdiet\u002Finspiration\u002Fhome-cooking\u002F:category\u002F:protein\u002F:recipeId"}>
        {() => (
          <AppLayout>
            <RecipePage />
          </AppLayout>
        )}
      </Route>
      <Route path={"\u002Fdiet\u002Finspiration\u002Fhome-cooking\u002F:category\u002F:protein\u002Fai-recommended"}>
        {() => (
          <AppLayout>
            <AIRecommendedRecipes />
          </AppLayout>
        )}
      </Route>
      <Route path={"\u002Fdiet\u002Finspiration\u002Fhome-cooking\u002F:category\u002F:protein\u002Ffitasty"}>
        {() => (
          <AppLayout>
            <FitastyIntegration />
          </AppLayout>
        )}
      </Route>
      <Route path={"\u002Fexercise"}>
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
      <Route path={"/settings/invite-friend"}>
        <AppLayout>
          <InviteFriend />
        </AppLayout>
      </Route>
      <Route path={"/ai-recommendations"}>
        <AppLayout>
          <AIRecommendations />
        </AppLayout>
      </Route>
      <Route path={"/mood-log"}>
        <AppLayout>
          <MoodLog />
        </AppLayout>
      </Route>
      <Route path={"*"} component={NotFound} />
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
