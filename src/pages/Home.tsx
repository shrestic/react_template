import {
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FiGlobe, FiHome, FiLogIn } from "react-icons/fi";

export function Home(): React.JSX.Element {
	const { t, i18n } = useTranslation();

	const bgGradient = useColorModeValue(
		"linear(to-br, teal.100, blue.200, teal.400)",
		"linear(to-br, teal.800, blue.900, gray.800)"
	);

	async function handleTranslateClick(): Promise<void> {
		if (i18n.resolvedLanguage === "en") {
			await i18n.changeLanguage("es");
		} else {
			await i18n.changeLanguage("en");
		}
	}

	return (
		<Flex
			align="center"
			bgGradient={bgGradient}
			justify="center"
			minH="100vh"
			w="100vw"
		>
			<Box
				backdropBlur="8px"
				bg={useColorModeValue("rgba(255,255,255,0.85)", "rgba(26,32,44,0.85)")}
				border="1.5px solid"
				borderColor={useColorModeValue("teal.200", "teal.600")}
				borderRadius="2xl"
				boxShadow="2xl"
				maxW="lg"
				px={{ base: 4, md: 10 }}
				py={{ base: 8, md: 14 }}
				w="100%"
			>
				<VStack align="center" spacing={8}>
					<Icon as={FiHome} color="teal.400" h={16} w={16} />
					<Heading
						bgClip="text"
						bgGradient="linear(to-r, teal.500, blue.500)"
						fontWeight="extrabold"
						mb={1}
						size="2xl"
						textAlign="center"
					>
						{t("home.greeting")}
					</Heading>
					<Text
						color={useColorModeValue("gray.700", "gray.200")}
						fontSize="xl"
						textAlign="center"
					>
						{t("home.welcomeMessage", {
							defaultValue: "Welcome to your beautiful, modern React app! 🎉",
						})}
					</Text>
					<Button
						boxShadow="lg"
						colorScheme="teal"
						leftIcon={<FiGlobe />}
						px={8}
						size="lg"
						variant="solid"
						onClick={handleTranslateClick}
					>
						{t("home.translateButton", { defaultValue: "Translate" })}
					</Button>
					<Button
						as={Link}
						colorScheme="blue"
						leftIcon={<FiLogIn />}
						size="lg"
						to="/login"
						variant="outline"
					>
						Go to Login
					</Button>
				</VStack>
			</Box>
		</Flex>
	);
}
