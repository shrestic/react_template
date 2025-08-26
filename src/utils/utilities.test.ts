import { describe, it, expect, vi, beforeEach } from "vitest";

describe("utilities", () => {
	beforeEach(() => {
		// Clear module cache before each test
		vi.resetModules();
	});

	describe("isProduction", () => {
		it("should return true when MODE is production", async () => {
			// Mock import.meta.env.MODE before importing the module
			vi.stubEnv("MODE", "production");

			// Re-import the module to get the updated value
			const { isProduction } = await import("./utilities");

			expect(isProduction).toBe(true);

			vi.unstubAllEnvs();
		});

		it("should return false when MODE is development", async () => {
			// Mock import.meta.env.MODE before importing the module
			vi.stubEnv("MODE", "development");

			// Re-import the module to get the updated value
			const { isProduction } = await import("./utilities");

			expect(isProduction).toBe(false);

			vi.unstubAllEnvs();
		});

		it("should return false when MODE is test", async () => {
			// Mock import.meta.env.MODE before importing the module
			vi.stubEnv("MODE", "test");

			// Re-import the module to get the updated value
			const { isProduction } = await import("./utilities");

			expect(isProduction).toBe(false);

			vi.unstubAllEnvs();
		});
	});
});
