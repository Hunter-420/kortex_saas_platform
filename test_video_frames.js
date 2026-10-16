const puppeteer = require('/home/rusty/.gemini/antigravity-cli/brain/f361e0dc-a29a-41d7-9ef1-e2503dd4a08b/scratch/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

async function testFrames() {
  console.log('Testing video player frame stepping...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--allow-file-access-from-files',
      '--disable-web-security',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
    ],
    headless: true
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  page.on('console', msg => console.log('[Player Console]:', msg.text()));
  page.on('pageerror', err => console.error('[Player PageError]:', err));

  await page.goto('file:///home/rusty/Desktop/gig2_kortex_ai_saas/kortex_video_player.html', {
    waitUntil: 'load',
    timeout: 30000
  });

  // Settle time for iframe
  await new Promise(r => setTimeout(r, 1500));

  const testTimes = [2.0, 12.0, 22.0, 30.0, 38.0, 46.0];
  const outDir = '/home/rusty/Desktop/gig2_kortex_ai_saas/gallery_and_assets';

  for (const t of testTimes) {
    console.log(`Stepping to t = ${t}s...`);
    await page.evaluate(currTime => window.seekTo(currTime), t);
    await new Promise(r => setTimeout(r, 200));
    const filename = `test_video_frame_${t.toFixed(0)}s.jpg`;
    await page.screenshot({ path: path.join(outDir, filename), type: 'jpeg', quality: 85 });
    console.log(`Captured ${filename}`);
  }

  await browser.close();
  console.log('Frame test finished successfully!');
}

testFrames().catch(err => {
  console.error('Frame test error:', err);
  process.exit(1);
});
