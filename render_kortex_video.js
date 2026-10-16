const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const puppeteer = require('/home/rusty/.gemini/antigravity-cli/brain/f361e0dc-a29a-41d7-9ef1-e2503dd4a08b/scratch/node_modules/puppeteer-core');

async function renderKortexVideo() {
  console.log('================================================================');
  console.log('🎬 Starting Fiverr Gig 2 Video Render: Kortex AI SaaS Platform');
  console.log('Target: 1920x1080 (1080p Full HD) · 24 FPS · 50.0s Duration');
  console.log('Zero Emojis · Agency-Grade Camera Rig · Desktop + iPhone 15 Pro');
  console.log('================================================================');

  const fps = 24;
  const durationSec = 50.0;
  const totalFrames = Math.floor(durationSec * fps); // 1200 frames
  const framesDir = '/tmp/kortex_frames';
  const outputVideo = '/home/rusty/Desktop/gig2_kortex_ai_saas/gallery_and_assets/kortex_saas_fiverr_presentation.mp4';
  const audioTrack = '/tmp/saas_soundtrack_mastered.wav';

  if (!fs.existsSync(audioTrack)) {
    throw new Error(`Mastered audio track not found at: ${audioTrack}`);
  }

  // Ensure clean frames directory
  if (fs.existsSync(framesDir)) {
    fs.rmSync(framesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(framesDir, { recursive: true });

  console.log('[1/4] Launching Chromium with optimized hardware pipeline...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--allow-file-access-from-files',
      '--disable-web-security',
      '--disable-dev-shm-usage',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-sync',
      '--hide-scrollbars',
      '--window-size=1920,1080'
    ],
    headless: true
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('[2/4] Loading choreographed presentation player...');
  await page.goto('file:///home/rusty/Desktop/gig2_kortex_ai_saas/kortex_video_player.html', {
    waitUntil: 'load',
    timeout: 30000
  });

  await new Promise((r) => setTimeout(r, 1200));

  console.log('[3/4] Capturing 1,200 high-definition frames (24 FPS, 50.0s)...');
  const startTime = Date.now();

  for (let frame = 0; frame < totalFrames; frame++) {
    const t = frame / fps;

    // Step animation timeline
    await page.evaluate((currTime) => window.seekTo(currTime), t);

    // Save frame to high-speed RAM disk
    const framePath = path.join(framesDir, `frame_${String(frame).padStart(5, '0')}.jpg`);
    await page.screenshot({
      path: framePath,
      type: 'jpeg',
      quality: 80
    });

    if (frame % 120 === 0 || frame === totalFrames - 1) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const percent = ((frame / totalFrames) * 100).toFixed(1);
      const currentSec = t.toFixed(1);
      const speed = (frame / ((Date.now() - startTime) / 1000)).toFixed(1);
      console.log(`[Progress] Frame ${frame}/${totalFrames} (${percent}%) | Video: ${currentSec}s/50.0s | Speed: ${speed} fps | Elapsed: ${elapsed}s`);
    }
  }

  await browser.close();
  console.log(`[3/4 Done] All 1,200 frames captured in ${((Date.now() - startTime) / 1000).toFixed(1)}s!`);

  console.log('[4/4] Encoding H.264 video with synchronized audio track via FFmpeg...');
  const ffmpegCmd = [
    'ffmpeg',
    '-y',
    '-framerate', String(fps),
    '-i', `${framesDir}/frame_%05d.jpg`,
    '-i', audioTrack,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    `"${outputVideo}"`
  ].join(' ');

  console.log('Running FFmpeg command:', ffmpegCmd);
  execSync(ffmpegCmd, { stdio: 'inherit' });

  // Cleanup temporary frames
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log('Temporary frames cleaned up from RAM disk.');

  const stats = fs.statSync(outputVideo);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

  // Copy to root directory and desktop root for easy access
  const copyPaths = [
    '/home/rusty/Desktop/gig2_kortex_ai_saas/kortex_saas_fiverr_presentation.mp4',
    '/home/rusty/Desktop/kortex_saas_fiverr_presentation.mp4'
  ];

  for (const cp of copyPaths) {
    fs.copyFileSync(outputVideo, cp);
    console.log(`Synced video to: ${cp}`);
  }

  console.log('================================================================');
  console.log('✨ KORTEX AI SAAS FIVERR VIDEO RENDER COMPLETE!');
  console.log(`📁 File: ${outputVideo}`);
  console.log(`📊 Size: ${sizeMb} MB (Fiverr Limit: 50 MB)`);
  console.log(`⏱️ Duration: 50.0 seconds (Fiverr Recommended Sweet Spot)`);
  console.log(`🎞️ Resolution: 1920x1080 (Full HD 16:9)`);
  console.log('🎉 100% Ready for direct upload to Fiverr Gig 2!');
  console.log('================================================================');
}

renderKortexVideo().catch((err) => {
  console.error('Fatal video render error:', err);
  process.exit(1);
});
