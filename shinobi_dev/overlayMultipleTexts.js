import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';

// Paths editing
const inputPath = '/home/carmaine/Рабочий стол/nodejs-practice/nodejs-practice/shinobi/output/stitched_output.mp4';
const outputPath = './output/video_with_multiple_texts.mp4';
const overlayJsonPath = './textOverlays.json';
const srtPath = './output/subtitles.srt';

// Font styles
const fontFile = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; // adjust as needed
const fontSize = 30;
const fontColor = 'white';
const boxColor = 'black@0.6';

async function overlayMultipleTexts() {
  try {
    const data = await fs.readFile(overlayJsonPath, 'utf-8');
    const overlays = JSON.parse(data);

    if (!Array.isArray(overlays)) {
      throw new Error('Invalid JSON format: should be an array.');
    }

    const drawtextFilters = overlays.map((entry, idx) => {
      const { text, start, duration } = entry;
      const enableExpr = `between(t,${start},${start + duration})`;
      const verticalOffset = 50 + idx * (fontSize + 20); // stack vertically

      return `drawtext=fontfile='${fontFile}':text='${text}':fontcolor=${fontColor}:fontsize=${fontSize}:box=1:boxcolor=${boxColor}:boxborderw=5:x=(w-text_w)/2:y=h-${verticalOffset}:enable='${enableExpr}'`;
    });

    const combinedFilter = drawtextFilters.join(',');

    // using enhanced text overlays with .json
    const cmd = `ffmpeg -i "${inputPath}" -vf "${combinedFilter}" -c:a copy "${outputPath}"`;

    // using (burning) .srt right into the video
    const cmdBurnSrt = `ffmpeg -i "${inputPath}" -vf subtitles="${srtPath}" -c:a copy "${outputPath}"`;

    console.log('🎬 Applying multiple text overlays...');
    exec(cmdBurnSrt, (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Overlay failed:', stderr);
      } else {
        console.log(`✅ Video saved with multiple overlays: ${outputPath}`);
      }
    });
  } catch (err) {
    console.error('❌ Error reading JSON or processing:', err.message);
  }
}

overlayMultipleTexts();
