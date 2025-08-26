import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Icon,
	Input,
	Spinner,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useLogin } from "../hooks/useAuth";
import { FiLogIn } from "react-icons/fi";

export function LoginPage(): React.JSX.Element {
	const login = useLogin();
	const toast = useToast();

	const [username, setUsername] = useState<string>("emilys");
	const [password, setPassword] = useState<string>("emilyspass");
	const [touchedFields, setTouchedFields] = useState<{
		username: boolean;
		password: boolean;
	}>({
		username: false,
		password: false,
	});

	// Handle toast on login success/failure
	useEffect((): void => {
		if (login.isSuccess) {
			toast({
				description: `Welcome, ${login.data?.username}!`,
				duration: 2500,
				isClosable: true,
				status: "success",
				title: "Login successful!",
			});
			// Redirect to /todos after a short delay to allow the toast to be seen
			window.location.href = "/todo";
		}
		if (login.isError) {
			toast({
				description: login.error?.message ?? "Invalid username or password.",
				duration: 3500,
				isClosable: true,
				status: "error",
				title: "Login failed!",
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [login.isSuccess, login.isError]);

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		setTouchedFields({ username: true, password: true });
		if (username && password) {
			login.mutate({ username, password });
		}
	}

	function handleUsernameChange(event: ChangeEvent<HTMLInputElement>): void {
		setUsername(event.target.value);
	}

	function handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
		setPassword(event.target.value);
	}

	function handleUsernameBlur(): void {
		setTouchedFields((previous) => ({ ...previous, username: true }));
	}

	function handlePasswordBlur(): void {
		setTouchedFields((previous) => ({ ...previous, password: true }));
	}

	return (
		<Flex
			align="center"
			bgGradient="linear(to-br, teal.50, blue.50)"
			justify="center"
			minH="100vh"
		>
			<Box
				bg="white"
				boxShadow="2xl"
				px={{ base: 4, md: 8 }}
				py={{ base: 6, md: 10 }}
				rounded="2xl"
				w={{ base: "96%", sm: "90%", md: "400px" }}
			>
				<VStack align="stretch" spacing={6}>
					<Flex justify="center">
						<Icon
							as={FiLogIn as React.ElementType}
							color="teal.400"
							h={10}
							w={10}
						/>
					</Flex>
					<Heading color="teal.700" mb={2} size="lg" textAlign="center">
						Sign In
					</Heading>
					<form autoComplete="off" onSubmit={handleSubmit}>
						<VStack align="stretch" spacing={5}>
							<FormControl isInvalid={touchedFields.username && !username}>
								<FormLabel>Username</FormLabel>
								<Input
									autoFocus
									placeholder="Enter your username"
									size="lg"
									value={username}
									onBlur={handleUsernameBlur}
									onChange={handleUsernameChange}
								/>
								<FormErrorMessage>Username is required.</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={touchedFields.password && !password}>
								<FormLabel>Password</FormLabel>
								<Input
									placeholder="Enter your password"
									size="lg"
									type="password"
									value={password}
									onBlur={handlePasswordBlur}
									onChange={handlePasswordChange}
								/>
								<FormErrorMessage>Password is required.</FormErrorMessage>
							</FormControl>
							<Button
								boxShadow="md"
								colorScheme="teal"
								disabled={!username || !password}
								isLoading={Boolean(login.status === "pending")}
								loadingText="Signing in..."
								mt={2}
								size="lg"
								type="submit"
								leftIcon={
									login.status === "pending" ? (
										<Spinner size="sm" />
									) : (
										<FiLogIn />
									)
								}
							>
								Sign In
							</Button>
						</VStack>
					</form>
				</VStack>
			</Box>
		</Flex>
	);
}
