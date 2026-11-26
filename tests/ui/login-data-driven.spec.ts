import {test, expect} from "../../src/fixtures/test.fixture";

import {
	validLoginUsers,
	invalidLoginUsers,
} from "../../src/test-data/login.data";

test.describe("Data Driven Login Tests", () => {
	// Positive login scenarios
	for (const user of validLoginUsers) {
		test(`Login should succeed - ${user.name}`, async ({loginPage, page}) => {
			await loginPage.login(user.username, user.password);

			await expect(page).toHaveURL(/inventory.html/);

			await expect(page.getByText("Products", {exact: true})).toBeVisible();
		});
	}

	// Negative login scenarios
	for (const user of invalidLoginUsers) {
		test(`Login should fail - ${user.name}`, async ({loginPage}) => {
			await loginPage.login(user.username, user.password);
            await loginPage.expectLoginError(user.expectedError);
		});
	}
});
