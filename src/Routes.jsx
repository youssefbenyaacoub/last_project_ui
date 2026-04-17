import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { Layout } from "./components/Layout";
import { FirstPage } from "./pages/FirstPage";
import { LoginPage } from "./pages/LoginPage";
import { ClientResetPasswordPage } from "./pages/ClientResetPasswordPage";
import { AgentLoginPage } from "./pages/AgentLoginPage";
import { AgentResetPasswordPage } from "./pages/AgentResetPasswordPage";
import { AgentChangePasswordPage } from "./pages/AgentChangePasswordPage";
import { AgentDashboardPage } from "./pages/AgentDashboardPage";
import { AdminPlatformPage } from "./pages/AdminPlatformPage";
import { SignInPage } from "./pages/SignInPage";
import { QuestPage } from "./pages/QuestPage";
import { ClientPage } from "./pages/ClientPage";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Chatbot } from "./pages/Chatbot";
import { Products } from "./pages/Products";
import { ProductComparator } from "./pages/ProductComparator";
import { Simulator } from "./pages/Simulator";
import { Budget } from "./pages/Budget";
import { Reclamation } from "./pages/Reclamation";
import { Parametres } from "./pages/Parametres";
import { FAQPage } from "./pages/FAQPage";
import {
  UserGuidesPage,
  SupportCenterPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
  SecurityPage,
} from "./pages/InfoPages";

export const router = createBrowserRouter([
  {
    Component: AppShell,
    children: [
      { index: true, Component: FirstPage },
      { path: "login", Component: LoginPage },
      { path: "reset-password", Component: ClientResetPasswordPage },
      { path: "agent", Component: AgentLoginPage },
      { path: "agent/login", Component: AgentLoginPage },
      { path: "agent/reset-password", Component: AgentResetPasswordPage },
      { path: "agent/change-password", Component: AgentChangePasswordPage },
      { path: "agent/dashboard", Component: AgentDashboardPage },
      { path: "agent/admin", Component: AdminPlatformPage },
      { path: "signin", Component: SignInPage },
      { path: "faq", Component: FAQPage },
      { path: "user-guides", Component: UserGuidesPage },
      { path: "support-center", Component: SupportCenterPage },
      { path: "privacy-policy", Component: PrivacyPolicyPage },
      { path: "terms-of-service", Component: TermsOfServicePage },
      { path: "security", Component: SecurityPage },
      { path: "quest", Component: QuestPage },
      { path: "client", Component: ClientPage },
      {
        path: "dashboard",
        Component: Layout,
        children: [
          { index: true, Component: Dashboard },
          { path: "profile", Component: Profile },
          { path: "chatbot", Component: Chatbot },
          { path: "products", Component: Products },
          { path: "product-comparator", Component: ProductComparator },
          { path: "simulator", Component: Simulator },
          { path: "budget", Component: Budget },
          { path: "reclamation", Component: Reclamation },
          { path: "parametres", Component: Parametres },
        ],
      },
    ],
  },
]);
