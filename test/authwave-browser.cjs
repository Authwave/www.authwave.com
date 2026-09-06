// Optional browser checks. Use the external Playwright/axe setup in README.md.
const {chromium} = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const baseUrl = process.env.AUTHWAVE_TEST_URL || 'http://localhost:8080';

(async () => {
	const browser = await chromium.launch({executablePath: process.env.FLAIR_CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox']});
	try {
		const context = await browser.newContext();
		await context.route('https://traffic.brightflair.com/**', route => route.abort());
		const page = await context.newPage();
		const errors = [];
		page.on('pageerror', error => errors.push(error.message));
		for(const width of [320, 390, 768, 959, 960, 1440, 1920]) {
			await page.setViewportSize({width, height: 1000});
			const response = await page.goto(`${baseUrl}/`);
			assert.equal(response.status(), 200);
			await page.evaluate(() => document.fonts.ready);
			assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${width}`);
			assert.equal(await page.locator('section-switcher').count(), 0);
			assert.equal(await page.locator('.authwave-connections').count(), 0);
			assert.ok(await page.locator('.authwave-login').isVisible());
			assert.equal(await page.locator('.authwave-hero-aside:visible').count(), width >= 960 ? 2 : 0);
			assert.equal(await page.locator('.authwave-feature:visible').count(), width >= 960 ? 4 : 1);
			const columns = await page.locator('.authwave-plans').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
			if(width <= 390) assert.equal(columns, 1);
			if(width >= 1440) assert.equal(columns, 3);
			const accessibility = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
			assert.deepEqual(accessibility.violations.map(item => ({id: item.id, nodes: item.nodes.map(node => node.target)})), [], `Accessibility at ${width}`);
			console.log(`Passed layout and accessibility: ${width}px`);
		}

		await page.locator('.authwave-form button[type="submit"]').click();
		assert.equal(await page.locator('.authwave-form').evaluate(form => form.checkValidity()), false);
		await page.locator('.authwave-form input[type="email"]').fill('preview@example.com');
		await page.locator('.authwave-form input[type="password"]').fill('preview-only');
		const loginUrl = page.url();
		await page.locator('.authwave-form button[type="submit"]').click();
		assert.match(await page.locator('[data-authwave-result]').textContent(), /No sign-in request/);
		assert.equal(page.url(), loginUrl);

		const requestedFonts = new Set();
		page.on('response', response => {
			if(response.url().includes('/asset/font/morion/')) {
				assert.equal(response.status(), 200);
				requestedFonts.add(new URL(response.url()).pathname);
			}
		});
		await page.reload();
		for(const weight of [100, 200, 300, 400, 600, 700]) {
			for(const style of ['normal', 'italic']) {
				const loaded = await page.evaluate(async ({weight, style}) => {
					const faces = await document.fonts.load(`${style} ${weight} 32px "Morion"`, 'Authwave');
					return faces.map(face => ({status: face.status, weight: face.weight, style: face.style}));
				}, {weight, style});
				assert.ok(loaded.some(face => face.status === 'loaded' && face.weight === String(weight) && face.style === style), `${weight} ${style}`);
			}
		}
		assert.equal(requestedFonts.size, 12);
		assert.match(await page.locator('#hero-title').evaluate(element => getComputedStyle(element).fontFamily), /Morion/);

		await page.setViewportSize({width: 390, height: 1000});
		const next = page.locator('[data-feature-next]');
		const previous = page.locator('[data-feature-previous]');
		assert.ok(await previous.isDisabled());
		for(let index = 1; index < 4; index++) {
			await next.click();
			assert.equal(await page.locator('.authwave-feature:visible h3').textContent(), ['Simple client libraries', 'Branding & customisation', 'Security by default', 'Fully open source'][index]);
		}
		assert.ok(await next.isDisabled());
		await previous.click();
		await page.setViewportSize({width: 1440, height: 1000});
		await page.waitForFunction(() => Array.from(document.querySelectorAll('.authwave-feature')).every(element => !element.hidden));
		assert.equal(await page.locator('.authwave-feature:visible').count(), 4);
		await page.setViewportSize({width: 390, height: 1000});
		await page.waitForFunction(() => Array.from(document.querySelectorAll('.authwave-feature')).filter(element => !element.hidden).length === 1);
		assert.equal(await page.locator('.authwave-feature:visible h3').textContent(), 'Security by default');

		const intro = page.locator('.authwave-intro-list > details');
		await intro.nth(1).locator('summary').click();
		assert.equal(await page.locator('.authwave-intro-list > details[open]').count(), 1);
		assert.ok(await intro.nth(1).evaluate(element => element.open));
		await page.locator('.authwave-audience-card summary').first().focus();
		await page.keyboard.press('Enter');
		assert.ok(await page.locator('.authwave-audience-card').first().evaluate(element => element.open));

		const nojs = await browser.newContext({javaScriptEnabled: false, viewport: {width: 390, height: 1000}});
		await nojs.route('https://traffic.brightflair.com/**', route => route.abort());
		const fallback = await nojs.newPage();
		await fallback.goto(`${baseUrl}/`);
		assert.equal(await fallback.locator('.authwave-feature:visible').count(), 4);
		assert.equal(await fallback.locator('.authwave-feature-controls:visible').count(), 0);
		await fallback.locator('.authwave-intro-list summary').nth(2).focus();
		await fallback.keyboard.press('Enter');
		assert.ok(await fallback.locator('.authwave-intro-list details').nth(2).evaluate(element => element.open));
		await fallback.locator('.authwave-form input[type="email"]').fill('preview@example.com');
		await fallback.locator('.authwave-form input[type="password"]').fill('preview-only');
		await fallback.locator('.authwave-form input[type="password"]').press('Enter');
		await fallback.waitForURL(url => url.hash === '#preview-note', {waitUntil: 'commit'});
		assert.equal(new URL(fallback.url()).search, '');
		assert.deepEqual(errors, []);
		console.log('Passed all twelve font faces, interactions, resizing, no-JavaScript fallback.');
	}
	finally {
		await browser.close();
	}
})().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
