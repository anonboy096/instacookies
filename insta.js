const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 10000; // Use Render's port or default to 10000

app.use(express.json());

app.post('/extract-cookies', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle0', timeout: 60000 });
        await page.waitForSelector('input[name="username"]');

        await page.type('input[name="username"]', username);
        await page.type('input[name="password"]', password);

        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
        ]);

        const cookies = await page.cookies();
        res.json({ cookies });
    } catch (error) {
        console.error('Error extracting cookies:', error);
        res.status(500).json({ error: 'Failed to extract cookies' });
    } finally {
        await browser.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
