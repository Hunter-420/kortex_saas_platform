const puppeteer = require('/home/rusty/.gemini/antigravity-cli/brain/f361e0dc-a29a-41d7-9ef1-e2503dd4a08b/scratch/node_modules/puppeteer-core');
const fs = require('fs');

async function testAndCapture() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-gpu'],
    headless: true
  });

  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // Desktop Viewport (1440x900)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('file:///home/rusty/Desktop/gig2_kortex_ai_saas/kortex_saas_platform/index.html', { waitUntil: 'networkidle0' });
  
  console.log('Page loaded successfully!');

  // 1. Take Desktop Hero Screenshot
  await page.screenshot({ path: '/home/rusty/Desktop/gig2_kortex_ai_saas/gallery_and_assets/01_desktop_hero_showcase.jpg', type: 'jpeg', quality: 95 });
  console.log('Captured: 01_desktop_hero_showcase.jpg');

  // 2. Scroll to Playground & trigger SEO task
  await page.evaluate(() => {
    document.getElementById('playground').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '/home/rusty/Desktop/gig2_kortex_ai_saas/gallery_and_assets/02_interactive_ai_playground.jpg', type: 'jpeg', quality: 95 });
  console.log('Captured: 02_interactive_ai_playground.jpg');

  // 3. Scroll to Bento Grid Section
  await page.evaluate(() => {
    document.getElementById('bento').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '/home/rusty/Desktop/gig2_kortex_ai_saas/gallery_and_assets/03_asymmetric_bento_grid.jpg', type: 'jpeg', quality: 95 });
  console.log('Captured: 03_asymmetric_bento_grid.jpg');

  // 4. Scroll to Pricing Calculator
  await page.evaluate(() => {
    document.getElementById('pricing').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '/home/rusty/Desktop/gig2_kortex_ai_saas/gallery_and_assets/04_dynamic_pricing_calculator.jpg', type: 'jpeg', quality: 95 });
  console.log('Captured: 04_dynamic_pricing_calculator.jpg');

  // 4b. Scroll to FAQ Section & Footer
  await page.evaluate(() => {
    document.getElementById('faq').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '/home/rusty/Desktop/gig2_kortex_ai_saas/gallery_and_assets/07_faq_and_footer.jpg', type: 'jpeg', quality: 95 });
  console.log('Captured: 07_faq_and_footer.jpg');

  // 5. Trigger Auth Modal & Capture
  await page.evaluate(() => {
    document.querySelector('.trigger-auth-modal').click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: '/home/rusty/Desktop/gig2_kortex_ai_saas/gallery_and_assets/05_google_auth_modal.jpg', type: 'jpeg', quality: 95 });
  console.log('Captured: 05_google_auth_modal.jpg');

  // Close modal
  await page.evaluate(() => {
    document.getElementById('closeAuthModalBtn').click();
  });
  await new Promise(r => setTimeout(r, 300));

  // 6. Test Mobile Viewport (iPhone 15 Pro)
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '/home/rusty/Desktop/gig2_kortex_ai_saas/gallery_and_assets/06_mobile_responsive_showcase.jpg', type: 'jpeg', quality: 95 });
  console.log('Captured: 06_mobile_responsive_showcase.jpg');

  console.log('Console / page errors during run:', errors);
  console.log('All gallery screenshots captured successfully!');
  await browser.close();
}

testAndCapture().catch(e => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
