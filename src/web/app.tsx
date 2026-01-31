import { Route, Switch } from "wouter";
import Index from "./pages/index";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import AgentDetails from "./pages/agent-details";
import { Provider } from "./components/provider";
import { Toaster } from "@/components/ui/sonner";

function App() {
	return (
		<Provider>
			<Switch>
				<Route path="/" component={Index} />
				<Route path="/login" component={Login} />
				<Route path="/signup" component={Signup} />
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/agents/:id" component={AgentDetails} />
			</Switch>
			<Toaster
				theme="dark"
				position="top-right"
				toastOptions={{
					style: {
						background: '#1A1625',
						border: '1px solid #252136',
						color: '#ffffff',
					},
				}}
			/>
		</Provider>
	);
}

export default App;
