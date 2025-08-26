import React from "react";
import {
	Box,
	Button,
	Checkbox,
	Flex,
	Heading,
	Icon,
	Input,
	Spinner,
	Text,
	VStack,
	HStack,
	Badge,
	Card,
	CardBody,
	useColorModeValue,
} from "@chakra-ui/react";
import { FiCheck, FiTrash2, FiUser, FiClock, FiPlus } from "react-icons/fi";
import type { Todo } from "./types";

interface TodoItemProps {
	todo: Todo;
	onToggle: (id: number) => void;
	onDelete: (id: number) => void;
}

interface TodoListProps {
	todos: Array<Todo>;
	onToggle: (id: number) => void;
	onDelete: (id: number) => void;
	loading?: boolean;
}

export const TodoItem = ({
	todo,
	onToggle,
	onDelete,
}: TodoItemProps): React.ReactElement => {
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.900", "white");
	const completedTextColor = useColorModeValue("gray.400", "gray.500");

	return (
		<Card
			bg={cardBg}
			border="1px"
			borderColor={borderColor}
			borderRadius="xl"
			mb={3}
			overflow="hidden"
			role="group"
			shadow="sm"
			transition="all 0.2s ease"
			_hover={{
				shadow: "lg",
				transform: "translateY(-1px)",
				borderColor: "purple.200",
			}}
		>
			<CardBody p={6}>
				<Flex align="center" gap={4} justify="space-between">
					<Flex align="center" flex={1} gap={4}>
						<Checkbox
							borderRadius="md"
							borderWidth="2px"
							colorScheme="purple"
							isChecked={todo.completed}
							size="lg"
							transition="all 0.2s ease"
							_hover={{
								borderColor: "purple.400",
								transform: "scale(1.05)",
							}}
							onChange={() => {
								onToggle(todo.id);
							}}
						/>

						<Box flex={1}>
							<Text
								color={todo.completed ? completedTextColor : textColor}
								fontSize="lg"
								fontWeight="600"
								lineHeight="1.4"
								mb={2}
								textDecoration={todo.completed ? "line-through" : "none"}
								transition="all 0.3s ease"
							>
								{todo.todo}
							</Text>

							<HStack spacing={3}>
								<Badge
									alignItems="center"
									borderRadius="full"
									colorScheme="blue"
									display="flex"
									fontSize="xs"
									fontWeight="medium"
									gap={1}
									px={3}
									py={1}
									variant="subtle"
								>
									<Icon as={FiUser} boxSize={3} />
									User {todo.userId}
								</Badge>

								{todo.completed && (
									<Badge
										alignItems="center"
										animation="pulse 2s infinite"
										borderRadius="full"
										colorScheme="green"
										display="flex"
										fontSize="xs"
										fontWeight="medium"
										gap={1}
										px={3}
										py={1}
										variant="subtle"
									>
										<Icon as={FiCheck} boxSize={3} />
										Completed
									</Badge>
								)}
							</HStack>
						</Box>
					</Flex>

					<Button
						_groupHover={{ opacity: 1 }}
						borderRadius="lg"
						colorScheme="red"
						opacity={0}
						size="sm"
						transition="all 0.2s ease"
						variant="ghost"
						_active={{
							transform: "scale(0.95)",
						}}
						_hover={{
							bg: "red.50",
							transform: "scale(1.1)",
						}}
						onClick={() => {
							onDelete(todo.id);
						}}
					>
						<Icon as={FiTrash2} boxSize={4} />
					</Button>
				</Flex>
			</CardBody>
		</Card>
	);
};

export const TodoList = ({
	todos,
	onToggle,
	onDelete,
	loading = false,
}: TodoListProps): React.ReactElement => {
	const emptyStateBg = useColorModeValue("gray.50", "gray.900");
	const emptyStateColor = useColorModeValue("gray.500", "gray.400");
	const textColor = useColorModeValue("gray.900", "white");

	if (loading) {
		return (
			<VStack spacing={4}>
				{Array.from({ length: 3 }).map((_, index) => (
					<Card key={index} bg="white" shadow="md" w="full">
						<CardBody>
							<Flex align="center" gap={4}>
								<Box bg="gray.200" borderRadius="md" h={6} w={6} />
								<Box flex={1}>
									<Box bg="gray.200" borderRadius="md" h={5} mb={2} w="75%" />
									<HStack spacing={2}>
										<Box bg="gray.200" borderRadius="full" h={6} w={16} />
										<Box bg="gray.200" borderRadius="full" h={6} w={20} />
									</HStack>
								</Box>
							</Flex>
						</CardBody>
					</Card>
				))}
			</VStack>
		);
	}

	if (todos.length === 0) {
		return (
			<VStack
				bg={emptyStateBg}
				border="2px dashed"
				borderColor="gray.300"
				borderRadius="xl"
				py={16}
				spacing={6}
			>
				<Box
					alignItems="center"
					bg="purple.100"
					borderRadius="2xl"
					display="flex"
					h={24}
					justifyContent="center"
					w={24}
				>
					<Icon as={FiCheck} boxSize={12} color="purple.400" />
				</Box>
				<Heading color={emptyStateColor} size="lg">
					No tasks yet
				</Heading>
			</VStack>
		);
	}

	const activeCount = todos.filter((todo) => !todo.completed).length;
	const completedCount = todos.filter((todo) => todo.completed).length;

	return (
		<VStack align="stretch" spacing={6}>
			<Flex align="center" justify="space-between" mb={6}>
				<Heading color={textColor} fontWeight="700" size="lg">
					Your Tasks
				</Heading>
				<HStack spacing={4}>
					<Badge
						alignItems="center"
						borderRadius="full"
						colorScheme="blue"
						display="flex"
						fontSize="sm"
						fontWeight="600"
						gap={2}
						px={4}
						py={2}
						variant="subtle"
					>
						<Icon as={FiClock} boxSize={4} />
						{activeCount} Active
					</Badge>
					<Badge
						alignItems="center"
						borderRadius="full"
						colorScheme="green"
						display="flex"
						fontSize="sm"
						fontWeight="600"
						gap={2}
						px={4}
						py={2}
						variant="subtle"
					>
						<Icon as={FiCheck} boxSize={4} />
						{completedCount} Completed
					</Badge>
				</HStack>
			</Flex>

			<VStack align="stretch" spacing={3}>
				{todos.map((todo, index) => (
					<Box
						key={todo.id}
						animation={`fadeInUp 0.5s ease ${index * 0.1}s forwards`}
						opacity={0}
					>
						<TodoItem todo={todo} onDelete={onDelete} onToggle={onToggle} />
					</Box>
				))}
			</VStack>
		</VStack>
	);
};

interface AddTodoFormProps {
	onAdd: (todo: string) => void;
	loading?: boolean;
}

export const AddTodoForm = ({
	onAdd,
	loading = false,
}: AddTodoFormProps): React.ReactElement => {
	const [todo, setTodo] = React.useState("");

	const handleSubmit = (event: React.FormEvent): void => {
		event.preventDefault();
		if (todo.trim()) {
			onAdd(todo.trim());
			setTodo("");
		}
	};

	return (
		<Card bg="white" borderRadius="3xl" mb={12} shadow="xl">
			<CardBody p={8}>
				<VStack align="stretch" spacing={6}>
					<Flex align="center" gap={4}>
						<Box
							alignItems="center"
							bg="purple.500"
							borderRadius="xl"
							display="flex"
							h={12}
							justifyContent="center"
							shadow="lg"
							w={12}
						>
							<Icon as={FiPlus} boxSize={6} color="white" />
						</Box>
						<Box>
							<Heading size="lg">Add New Task</Heading>
							<Text color="gray.600">
								Transform your ideas into actionable tasks
							</Text>
						</Box>
					</Flex>

					<form onSubmit={handleSubmit}>
						<HStack spacing={4}>
							<Input
								borderRadius="xl"
								disabled={loading}
								focusBorderColor="purple.500"
								placeholder="What needs to be done?"
								size="lg"
								value={todo}
								onChange={(event) => {
									setTodo(event.target.value);
								}}
							/>
							<Button
								borderRadius="xl"
								colorScheme="purple"
								disabled={loading || !todo.trim()}
								px={8}
								size="lg"
								type="submit"
								leftIcon={
									loading ? <Spinner size="sm" /> : <Icon as={FiPlus} />
								}
							>
								{loading ? "Adding..." : "Add Task"}
							</Button>
						</HStack>
					</form>
				</VStack>
			</CardBody>
		</Card>
	);
};
