const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: 'C:\\Users\\SAMANT~1\\AppData\\Local\\Temp\\screenshot.png', fullPage: false });
  console.log('Screenshot saved successfully.');

  // Extract visual details from the page
  const details = await page.evaluate(() => {
    const body = document.body;
    const style = window.getComputedStyle(body);
    const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim()).filter(t => t);
    return {
      font: style.fontFamily,
      bgColor: style.backgroundColor,
      headings: headings.slice(0, 10),
      title: document.title
    };
  });
  console.log(JSON.stringify(details, null, 2));

  await browser.close();
})();
