import type React from "react";
import {
	Box,
	Container,
	Grid,
	GridItem,
	Text,
	HStack,
	Icon,
	useColorModeValue,
} from "@chakra-ui/react";
import { FiCheck, FiClock, FiList } from "react-icons/fi";
import { TodoList, AddTodoForm } from "../features/todo/components";
import {
	useTodos,
	useAddTodo,
	useUpdateTodo,
	useDeleteTodo,
} from "../features/todo/hooks";

const TodoPage = (): React.ReactElement => {
	const { data: todosData, isLoading } = useTodos(30, 0);
	const addTodoMutation = useAddTodo();
	const updateTodoMutation = useUpdateTodo();
	const deleteTodoMutation = useDeleteTodo();

	const todos = todosData?.todos || [];

	const handleAddTodo = (todoText: string): void => {
		addTodoMutation.mutate({
			todo: todoText,
			completed: false,
			userId: 1,
		});
	};

	const handleToggleTodo = (id: number): void => {
		const todo = todos.find((t) => t.id === id);
		if (todo) {
			updateTodoMutation.mutate({
				id,
				data: { completed: !todo.completed },
			});
		}
	};

	const handleDeleteTodo = (id: number): void => {
		deleteTodoMutation.mutate(id);
	};

	const bgGradient = useColorModeValue(
		"linear(to-br, purple.50, blue.50)",
		"linear(to-br, gray.900, gray.800)"
	);
	const cardBg = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.900", "white");

	return (
		<Box
			bgGradient={bgGradient}
			minH="100vh"
			overflow="hidden"
			position="relative"
		>
			{/* Background decoration */}
			<Box inset={0} overflow="hidden" pointerEvents="none" position="absolute">
				<Box
					bgGradient="linear(to-br, purple.200, blue.200)"
					borderRadius="full"
					filter="blur(3xl)"
					h="320px"
					opacity={0.2}
					position="absolute"
					right="-160px"
					top="-160px"
					w="320px"
				/>
				<Box
					bgGradient="linear(to-tr, blue.200, purple.200)"
					borderRadius="full"
					bottom="-160px"
					filter="blur(3xl)"
					h="320px"
					left="-160px"
					opacity={0.2}
					position="absolute"
					w="320px"
				/>
			</Box>

			<Container maxW="6xl" position="relative" px={4} py={12}>
				{/* Stats Cards */}
				<Grid
					gap={6}
					mb={12}
					templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
				>
					<GridItem>
						<Box
							bg={cardBg}
							border="1px"
							borderColor={useColorModeValue("gray.200", "gray.700")}
							borderRadius="2xl"
							p={6}
							shadow="xl"
						>
							<HStack>
								<Box
									alignItems="center"
									bgGradient="linear(to-br, blue.500, blue.600)"
									borderRadius="xl"
									display="flex"
									h={12}
									justifyContent="center"
									w={12}
								>
									<Icon as={FiList} boxSize={6} color="white" />
								</Box>
								<Box>
									<Text color="gray.600" fontSize="sm" fontWeight="medium">
										Total Tasks
									</Text>
									<Text color={textColor} fontSize="2xl" fontWeight="bold">
										{todos.length}
									</Text>
								</Box>
							</HStack>
						</Box>
					</GridItem>

					<GridItem>
						<Box
							bg={cardBg}
							border="1px"
							borderColor={useColorModeValue("gray.200", "gray.700")}
							borderRadius="2xl"
							p={6}
							shadow="xl"
						>
							<HStack>
								<Box
									alignItems="center"
									bgGradient="linear(to-br, orange.500, yellow.500)"
									borderRadius="xl"
									display="flex"
									h={12}
									justifyContent="center"
									w={12}
								>
									<Icon as={FiClock} boxSize={6} color="white" />
								</Box>
								<Box>
									<Text color="gray.600" fontSize="sm" fontWeight="medium">
										Active
									</Text>
									<Text color={textColor} fontSize="2xl" fontWeight="bold">
										{todos.filter((todo) => !todo.completed).length}
									</Text>
								</Box>
							</HStack>
						</Box>
					</GridItem>

					<GridItem>
						<Box
							bg={cardBg}
							border="1px"
							borderColor={useColorModeValue("gray.200", "gray.700")}
							borderRadius="2xl"
							p={6}
							shadow="xl"
						>
							<HStack>
								<Box
									alignItems="center"
									bgGradient="linear(to-br, green.500, emerald.500)"
									borderRadius="xl"
									display="flex"
									h={12}
									justifyContent="center"
									w={12}
								>
									<Icon as={FiCheck} boxSize={6} color="white" />
								</Box>
								<Box>
									<Text color="gray.600" fontSize="sm" fontWeight="medium">
										Completed
									</Text>
									<Text color={textColor} fontSize="2xl" fontWeight="bold">
										{todos.filter((todo) => todo.completed).length}
									</Text>
								</Box>
							</HStack>
						</Box>
					</GridItem>
				</Grid>

				<AddTodoForm
					loading={addTodoMutation.isPending}
					onAdd={handleAddTodo}
				/>

				<TodoList
					loading={isLoading}
					todos={todos}
					onDelete={handleDeleteTodo}
					onToggle={handleToggleTodo}
				/>
			</Container>
		</Box>
	);
};

export default TodoPage;
