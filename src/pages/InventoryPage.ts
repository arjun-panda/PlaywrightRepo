import {type Locator, type Page, expect} from "@playwright/test";

export class InventoryPage {
	readonly title: Locator;
	readonly inventoryItems: Locator;
	readonly sortDropdown: Locator;
	readonly cartLink: Locator;
	readonly cartBadge: Locator;

	constructor(private readonly page: Page) {
		this.title = page.getByText("Products", {exact: true});
		this.inventoryItems = page.locator(".inventory_item");
		this.sortDropdown = page.locator("select.product_sort_container");
		// this.cartLink = page.getByRole("link", {name: "Shopping Cart"});
		this.cartLink = page.locator(".shopping_cart_link");
		this.cartBadge = page.locator(".shopping_cart_badge");
	}

	async expectLoaded(): Promise<void> {
		await expect(this.page).toHaveURL(/inventory\.html/);
		await expect(this.title).toBeVisible();
	}

	async expectProductCount(count: number): Promise<void> {
		await expect(this.inventoryItems).toHaveCount(count);
	}

	async addProductToCart(productName: string): Promise<void> {
		const productNameLocator = this.page.getByText(productName, {
			exact: true,
		});

		const product = this.inventoryItems.filter({
			has: productNameLocator,
		});

		await expect(product).toHaveCount(1);

		await product
			.getByRole("button", {
				name: "Add to cart",
				exact: true,
			})
			.click();
	}

	async sortBy(value: "az" | "za" | "lohi" | "hilo"): Promise<void> {
		await this.sortDropdown.selectOption(value);
	}

	async getProductPrices(): Promise<number[]> {
		const prices = await this.page
			.locator(".inventory_item_price")
			.allTextContents();
		return prices.map((price) => Number(price.replace("$", "").trim()));
	}

	async openCart(): Promise<void> {
		await this.cartLink.click();
	}
}
