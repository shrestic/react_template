import { createFileRoute, redirect } from "@tanstack/react-router";
import TodoPage from "../pages/TodoPage";

export const Route = createFileRoute("/todo")({
	beforeLoad: () => {
		const token = localStorage.getItem("accessToken");
		if (!token) redirect({ to: "/login" });
	},
	component: TodoPage,
});
