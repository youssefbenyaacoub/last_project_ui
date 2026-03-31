import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { FirstPage } from "./pages/FirstPage";
import { LoginPage } from "./pages/LoginPage";
import { SignInPage } from "./pages/SignInPage";
import { QuestPage } from "./pages/QuestPage";
import { ClientPage } from "./pages/ClientPage";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Chatbot } from "./pages/Chatbot";
import { Products } from "./pages/Products";
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
    path: "/",
    Component: FirstPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signin",
    Component: SignInPage,
  },
  {
    path: "/faq",
    Component: FAQPage,
  },
  {
    path: "/user-guides",
    Component: UserGuidesPage,
  },
  {
    path: "/support-center",
    Component: SupportCenterPage,
  },
  {
    path: "/privacy-policy",
    Component: PrivacyPolicyPage,
  },
  {
    path: "/terms-of-service",
    Component: TermsOfServicePage,
  },
  {
    path: "/security",
    Component: SecurityPage,
  },
  {
    path: "/quest",
    Component: QuestPage,
  },
  {
    path: "/client",
    Component: ClientPage,
  },
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "profile", Component: Profile },
      { path: "chatbot", Component: Chatbot },
      { path: "products", Component: Products },
      { path: "simulator", Component: Simulator },
      { path: "budget", Component: Budget },
      { path: "reclamation", Component: Reclamation },
      { path: "parametres", Component: Parametres },
    ],
  },
]);
