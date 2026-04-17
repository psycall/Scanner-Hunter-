import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Wallets from "./pages/Wallets";
import CreatePaymentLink from "./pages/CreatePaymentLink";
import PaymentPage from "./pages/PaymentPage";
import PaymentLinks from "./pages/PaymentLinks";
import Transactions from "./pages/Transactions";
import AdminPanel from "./pages/AdminPanel";
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from "./lib/wagmi-config";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/wallets" component={Wallets} />
      <Route path="/payment-links" component={PaymentLinks} />
      <Route path="/payment-links/new" component={CreatePaymentLink} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/pay/:slug" component={PaymentPage} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <WagmiProvider config={wagmiConfig}>
        <ThemeProvider
          defaultTheme="dark"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}

export default App;
