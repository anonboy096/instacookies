const puppeteer = require('puppeteer');

(async () => {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: false }); // Set headless: true for no UI
    const page = await browser.newPage();

    try {
        // Navigate to Instagram's login page
        await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle0', timeout: 60000 });

        // Wait for the login form to load
        await page.waitForSelector('input[name="username"]');

        // Fill in your username and password here
        const username = 'YOUR_USERNAME'; // replace with your Instagram username
        const password = 'YOUR_PASSWORD'; // replace with your Instagram password

        await page.type('input[name="username"]', username);
        await page.type('input[name="password"]', password);

        // Click the login button
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
        ]);

        // Extract cookies after logging in
        const cookies = await page.cookies();
        
        console.log('Extracted Cookies:', cookies);

    } catch (error) {
        if (error instanceof puppeteer.errors.TimeoutError) {
            console.error('Navigation timed out:', error);
        } else {
            console.error('An error occurred:', error);
        }
    } finally {
        // Close the browser
        await browser.close();
    }
})();