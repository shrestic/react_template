import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import api from "../utils/api";

export interface LoginBody {
	username: string;
	password: string;
}
export interface LoginResponse {
	id: number;
	username: string;
	email: string;
	accessToken: string;
	refreshToken: string;
}

export function useLogin(): UseMutationResult<LoginResponse, Error, LoginBody> {
	return useMutation<LoginResponse, Error, LoginBody>({
		mutationFn: async (body: LoginBody): Promise<LoginResponse> => {
			const response = await api.post("/user/login", body);
			return response.data as LoginResponse;
		},
		onSuccess: (user: LoginResponse): void => {
			localStorage.setItem("accessToken", user.accessToken);
			localStorage.setItem("refreshToken", user.refreshToken);
			localStorage.setItem("currentUser", JSON.stringify(user));
		},
	});
}

export function useLogout(): () => void {
	return (): void => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("currentUser");
	};
}
