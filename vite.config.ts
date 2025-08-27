import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		viteStaticCopy({
			targets: [
				{
					src: normalizePath(path.resolve("./src/assets/locales")),
					dest: normalizePath(path.resolve("./dist")),
				},
			],
		}),
	],
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		css: true,
		globals: true,
	},
	server: {
		host: true,
		strictPort: true,
	},
});
