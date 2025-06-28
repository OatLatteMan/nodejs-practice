// overlayMultipleTexts.js
import { exec } from 'child_process';
import fs from 'fs/promises';

// const inputPath = process.argv[2];
// const jsonPath = process.argv[3];

const inputPath = '/home/carmaine/Рабочий стол/nodejs-practice/nodejs-practice/shinobi/output/stitched_output.mp4';
const jsonPath = './textOverlaysEnhanced.json';
const outputPath = './output/video_with_enchanced_text.mp4';

if (!inputPath || !jsonPath) {
  console.error('❌ Usage: node overlayMultipleTexts.js <videoPath> <textJsonPath>');
  process.exit(1);
}

try {
  const rawJson = await fs.readFile(jsonPath, 'utf-8');
  const clips = JSON.parse(rawJson);

  if (!Array.isArray(clips)) throw new Error('JSON should be an array');

  const drawtextFilters = clips.map((clip) => {
    const {
      start,
      end,
      text,
      x = '(w-text_w)/2',
      y = '50',
      fontcolor = 'white',
      fontsize = 24,
      fade = false,
    } = clip;

    if (start == null || end == null || !text) {
      throw new Error('Each clip must include start, end, and text');
    }

    const enable = `between(t\\,${start}\\,${end})`;
    const fadeExpr = fade ? `:alpha='if(lt(t,${start + 0.3}),0,if(lt(t,${end - 0.3}),1,0))'` : '';
    return `drawtext=text='${text.replace(/'/g, "\\'")}':x=${x}:y=${y}:fontcolor=${fontcolor}:fontsize=${fontsize}:enable='${enable}'${fadeExpr}`;
  });

  const filterStr = drawtextFilters.join(',');

  const ffmpegCmd = `ffmpeg -i "${inputPath}" -vf "${filterStr}" -c:a copy "${outputPath}"`;

  console.log(`🎬 Running: ${ffmpegCmd}`);
  exec(ffmpegCmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ FFmpeg failed: ${error.message}`);
      console.error(stderr);
    } else {
      console.log(`✅ Video saved as: ${outputPath}`);
    }
  });

} catch (err) {
  console.error('❌ Error:', err.message);
}
