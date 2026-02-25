const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600 });
  
  // Go to page
  await page.goto('http://localhost:8080');
  
  // Wait for load
  await page.waitForSelector('.step[data-step="3"]');
  
  // Force step 3 to be active
  await page.evaluate(() => {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step').forEach(el => {
      el.classList.remove('active');
      el.classList.add('completed');
    });
    
    document.getElementById('step3').classList.add('active');
    const step3Indicator = document.querySelector('.step[data-step="3"]');
    step3Indicator.classList.remove('completed');
    step3Indicator.classList.add('active');
    
    // Also click the add residence button to show the dynamically added form
    document.getElementById('addResidenceBtn').click();
  });
  
  // Give it a moment to render
  await new Promise(r => setTimeout(r, 500));
  
  // Take screenshot
  await page.screenshot({ path: '/Users/vn58osw/.gemini/antigravity/brain/99d81654-f469-45e1-9b79-f7aa4f51fe43/residential_history_verified.png' });
  
  await browser.close();
  console.log('Screenshot saved to residential_history_verified.png');
})();
