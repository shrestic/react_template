import { createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { routeTree } from "./routeTree.gen.ts";
import "./styles/tailwind.css";
import "./utils/i18n.ts";
import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";

const router = createRouter({ routeTree });

export type TanstackRouter = typeof router;

declare module "@tanstack/react-router" {
	interface Register {
		// This infers the type of our router and registers it across your entire project
		router: TanstackRouter;
	}
}

const rootElement = document.querySelector("#root") as Element;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<ChakraProvider>
			<React.StrictMode>
				<React.Suspense
					fallback={
						<Center minH="100vh">
							<Spinner color="teal.500" size="xl" thickness="4px" />
						</Center>
					}
				>
					<App router={router} />
				</React.Suspense>
			</React.StrictMode>
		</ChakraProvider>
	);
}
