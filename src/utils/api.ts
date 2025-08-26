import axios, {
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";

// Types
interface Todo {
	id: number;
	todo: string;
	completed: boolean;
	userId: number;
}

interface TodoListResponse {
	todos: Array<Todo>;
	total: number;
	skip: number;
	limit: number;
}

interface ApiResponse<T> {
	data: T;
}

interface MockApi {
	get: (url: string) => Promise<ApiResponse<Todo | TodoListResponse>>;
	post: (url: string, data: Partial<Todo>) => Promise<ApiResponse<Todo>>;
	put: (url: string, data: Partial<Todo>) => Promise<ApiResponse<Todo>>;
	delete: (url: string) => Promise<ApiResponse<Todo>>;
}

// Mock data for local development
const mockTodos: Array<Todo> = [
	{
		id: 1,
		todo: "Learn React",
		completed: false,
		userId: 1,
	},
	{
		id: 2,
		todo: "Build a todo app",
		completed: true,
		userId: 1,
	},
	{
		id: 3,
		todo: "Deploy to production",
		completed: false,
		userId: 1,
	},
];

let nextId = 4;

// Mock API functions for local development
const mockApi: MockApi = {
	get: (url: string): Promise<ApiResponse<Todo | TodoListResponse>> => {
		if (url.includes("/todos?limit=")) {
			const limit = parseInt(url.match(/limit=(\d+)/)?.[1] || "30");
			const skip = parseInt(url.match(/skip=(\d+)/)?.[1] || "0");
			return Promise.resolve({
				data: {
					todos: mockTodos.slice(skip, skip + limit),
					total: mockTodos.length,
					skip,
					limit,
				},
			});
		}
		if (url.includes("/todos/")) {
			const id = parseInt(url.split("/").pop() || "0");
			const todo = mockTodos.find((t) => t.id === id);
			if (!todo) throw new Error("Todo not found");
			return Promise.resolve({ data: todo });
		}
		throw new Error("Not implemented");
	},
	post: (url: string, data: Partial<Todo>): Promise<ApiResponse<Todo>> => {
		if (url === "/todos/add") {
			const newTodo: Todo = {
				id: nextId++,
				todo: data.todo ?? "",
				completed: data.completed ?? false,
				userId: data.userId ?? 1,
			};
			mockTodos.unshift(newTodo);
			return Promise.resolve({ data: newTodo });
		}
		throw new Error("Not implemented");
	},
	put: (url: string, data: Partial<Todo>): Promise<ApiResponse<Todo>> => {
		if (url.includes("/todos/")) {
			const id = parseInt(url.split("/").pop() || "0");
			const index = mockTodos.findIndex((t) => t.id === id);
			if (index === -1) throw new Error("Todo not found");
			const existingTodo = mockTodos[index];
			if (!existingTodo) throw new Error("Todo not found");
			const updatedTodo: Todo = {
				id: existingTodo.id,
				todo: data.todo !== undefined ? data.todo : existingTodo.todo,
				completed:
					data.completed !== undefined
						? data.completed
						: existingTodo.completed,
				userId: data.userId !== undefined ? data.userId : existingTodo.userId,
			};
			mockTodos[index] = updatedTodo;
			return Promise.resolve({ data: updatedTodo });
		}
		throw new Error("Not implemented");
	},
	delete: (url: string): Promise<ApiResponse<Todo>> => {
		if (url.includes("/todos/")) {
			const id = parseInt(url.split("/").pop() || "0");
			const index = mockTodos.findIndex((t) => t.id === id);
			if (index === -1) throw new Error("Todo not found");
			const deletedTodo = mockTodos[index];
			mockTodos.splice(index, 1);
			if (!deletedTodo) throw new Error("Todo not found");
			return Promise.resolve({ data: deletedTodo });
		}
		throw new Error("Not implemented");
	},
};
// Use mock API for development, real API for production
const isDevelopment = import.meta.env.DEV;

let api: MockApi | AxiosInstance;

if (isDevelopment) {
	api = mockApi;
} else {
	api = axios.create({
		baseURL: "https://dummyjson.com",
		timeout: 10000,
	});

	// Add request interceptor for real API
	(api as AxiosInstance).interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			const token = localStorage.getItem("accessToken");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		}
	);
}

export default api;
