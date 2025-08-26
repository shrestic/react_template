import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryResult,
	type UseMutationResult,
} from "@tanstack/react-query";
import api from "../../utils/api";
import type { Todo, TodoListResponse } from "./types";

// Query Keys
export const todoQueryKeys = {
	all: ["todos"] as const,
	lists: () => [...todoQueryKeys.all, "list"] as const,
	list: (limit: number, skip: number) =>
		[...todoQueryKeys.lists(), { limit, skip }] as const,
	details: () => [...todoQueryKeys.all, "detail"] as const,
	detail: (id: number) => [...todoQueryKeys.details(), id] as const,
	random: () => [...todoQueryKeys.all, "random"] as const,
	byUser: (userId: number) => [...todoQueryKeys.all, "user", userId] as const,
};

// API Functions
export async function fetchTodos(
	limit = 30,
	skip = 0
): Promise<TodoListResponse> {
	const response = await api.get(`/todos?limit=${limit}&skip=${skip}`);
	return response.data as TodoListResponse;
}

export async function fetchTodo(id: number): Promise<Todo> {
	const response = await api.get(`/todos/${id}`);
	return response.data as Todo;
}

export async function fetchRandomTodo(): Promise<Todo> {
	const response = await api.get("/todos/random");
	return response.data as Todo;
}

export async function fetchTodosByUser(
	userId: number
): Promise<TodoListResponse> {
	const response = await api.get(`/todos/user/${userId}`);
	return response.data as TodoListResponse;
}

export async function addTodo(todo: Omit<Todo, "id">): Promise<Todo> {
	const response = await api.post("/todos/add", todo);
	return response.data as Todo;
}

export async function updateTodo(
	id: number,
	data: Partial<Todo>
): Promise<Todo> {
	const response = await api.put(`/todos/${id}`, data);
	return response.data as Todo;
}

export async function deleteTodo(id: number): Promise<Todo> {
	const response = await api.delete(`/todos/${id}`);
	return response.data as Todo;
}

// React Query Hooks

export function useTodos(
	limit = 30,
	skip = 0
): UseQueryResult<TodoListResponse, Error> {
	return useQuery({
		queryKey: todoQueryKeys.list(limit, skip),
		queryFn: () => fetchTodos(limit, skip),
	});
}

export function useTodo(id: number): UseQueryResult<Todo, Error> {
	return useQuery({
		queryKey: todoQueryKeys.detail(id),
		queryFn: () => fetchTodo(id),
		enabled: id ? true : false,
	});
}

export function useRandomTodo(): UseQueryResult<Todo, Error> {
	return useQuery({
		queryKey: todoQueryKeys.random(),
		queryFn: fetchRandomTodo,
	});
}

export function useTodosByUser(
	userId: number
): UseQueryResult<TodoListResponse, Error> {
	return useQuery({
		queryKey: todoQueryKeys.byUser(userId),
		queryFn: () => fetchTodosByUser(userId),
		enabled: userId ? true : false,
	});
}

export function useAddTodo(): UseMutationResult<Todo, Error, Omit<Todo, "id">> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addTodo,
		onMutate: async (newTodo) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: todoQueryKeys.lists() });

			// Snapshot the previous value
			const previousTodos = queryClient.getQueryData<TodoListResponse>(
				todoQueryKeys.list(30, 0)
			);

			// Optimistically update to the new value
			if (previousTodos) {
				const optimisticTodo: Todo = {
					id: Date.now(), // Temporary ID
					...newTodo,
				};
				queryClient.setQueryData<TodoListResponse>(todoQueryKeys.list(30, 0), {
					...previousTodos,
					todos: [optimisticTodo, ...previousTodos.todos],
					total: previousTodos.total + 1,
				});
			}

			// Return a context object with the snapshotted value
			return { previousTodos };
		},
		onError: (error, _newTodo, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousTodos) {
				queryClient.setQueryData(
					todoQueryKeys.list(30, 0),
					context.previousTodos
				);
			}
			console.error("Failed to add todo:", error);
		},
		onSettled: () => {
			// Always refetch after error or success
			void queryClient.invalidateQueries({ queryKey: todoQueryKeys.lists() });
		},
	});
}

export function useUpdateTodo(): UseMutationResult<
	Todo,
	Error,
	{ id: number; data: Partial<Todo> }
> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => updateTodo(id, data),
		onMutate: async ({ id, data }) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: todoQueryKeys.lists() });

			// Snapshot the previous value
			const previousTodos = queryClient.getQueryData<TodoListResponse>(
				todoQueryKeys.list(30, 0)
			);

			// Optimistically update to the new value
			if (previousTodos) {
				queryClient.setQueryData<TodoListResponse>(todoQueryKeys.list(30, 0), {
					...previousTodos,
					todos: previousTodos.todos.map((todo) =>
						todo.id === id ? { ...todo, ...data } : todo
					),
				});
			}

			// Return a context object with the snapshotted value
			return { previousTodos };
		},
		onError: (error, _variables, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousTodos) {
				queryClient.setQueryData(
					todoQueryKeys.list(30, 0),
					context.previousTodos
				);
			}
			console.error("Failed to update todo:", error);
		},
		onSuccess: (updatedTodo) => {
			// Update the specific todo in cache
			queryClient.setQueryData(
				todoQueryKeys.detail(updatedTodo.id),
				updatedTodo
			);
			// Invalidate lists to ensure consistency
			void queryClient.invalidateQueries({ queryKey: todoQueryKeys.lists() });
			void queryClient.invalidateQueries({
				queryKey: todoQueryKeys.byUser(updatedTodo.userId),
			});
		},
		onSettled: () => {
			// Always refetch after error or success
			void queryClient.invalidateQueries({ queryKey: todoQueryKeys.lists() });
		},
	});
}

export function useDeleteTodo(): UseMutationResult<Todo, Error, number> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTodo,
		onMutate: async (id) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: todoQueryKeys.lists() });

			// Snapshot the previous value
			const previousTodos = queryClient.getQueryData<TodoListResponse>(
				todoQueryKeys.list(30, 0)
			);

			// Optimistically update to the new value
			if (previousTodos) {
				queryClient.setQueryData<TodoListResponse>(todoQueryKeys.list(30, 0), {
					...previousTodos,
					todos: previousTodos.todos.filter((todo) => todo.id !== id),
					total: previousTodos.total - 1,
				});
			}

			// Return a context object with the snapshotted value
			return { previousTodos };
		},
		onError: (error, _id, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousTodos) {
				queryClient.setQueryData(
					todoQueryKeys.list(30, 0),
					context.previousTodos
				);
			}
			console.error("Failed to delete todo:", error);
		},
		onSuccess: (deletedTodo) => {
			// Remove from cache
			queryClient.removeQueries({
				queryKey: todoQueryKeys.detail(deletedTodo.id),
			});
			// Invalidate lists to ensure consistency
			void queryClient.invalidateQueries({ queryKey: todoQueryKeys.lists() });
			void queryClient.invalidateQueries({
				queryKey: todoQueryKeys.byUser(deletedTodo.userId),
			});
		},
		onSettled: () => {
			// Always refetch after error or success
			void queryClient.invalidateQueries({ queryKey: todoQueryKeys.lists() });
		},
	});
}
