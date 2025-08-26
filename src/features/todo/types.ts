export interface Todo {
	id: number;
	todo: string;
	completed: boolean;
	userId: number;
}

export interface TodoListResponse {
	todos: Array<Todo>;
	total: number;
	skip: number;
	limit: number;
}
