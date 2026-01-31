import { useState, useEffect } from 'react';
import { Route, Switch } from "wouter";
import Index from "./pages/index";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import AgentDetails from "./pages/agent-details";
import { Provider } from "./components/provider";
import { Toaster } from "@/components/ui/sonner";
import SplashScreen from "./components/splash-screen";

function App() {
	const [showSplash, setShowSplash] = useState(true);
	const [appReady, setAppReady] = useState(false);

	// Check if we've shown splash this session
	useEffect(() => {
		const hasSeenSplash = sessionStorage.getItem('zukii-splash-shown');
		if (hasSeenSplash) {
			setShowSplash(false);
			setAppReady(true);
		}
	}, []);

	const handleSplashComplete = () => {
		sessionStorage.setItem('zukii-splash-shown', 'true');
		setShowSplash(false);
		// Small delay to ensure smooth transition
		setTimeout(() => setAppReady(true), 100);
	};

	return (
		<Provider>
			{showSplash && <SplashScreen onComplete={handleSplashComplete} />}
			
			<div className={`transition-opacity duration-500 ${appReady ? 'opacity-100' : 'opacity-0'}`}>
				<Switch>
					<Route path="/" component={Index} />
					<Route path="/login" component={Login} />
					<Route path="/signup" component={Signup} />
					<Route path="/dashboard" component={Dashboard} />
					<Route path="/agents/:id" component={AgentDetails} />
				</Switch>
			</div>
			
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
