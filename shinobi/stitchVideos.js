// stitchVideos.js
import fs from 'fs/promises';
import { existsSync, createWriteStream } from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, 'output');
const tempDir = path.join(__dirname, 'tmp');
const clipsFile = path.join(__dirname, 'clips.json');
const concatListFile = path.join(tempDir, 'concat-list.txt');

// Ensure temp and output folders exist
await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(tempDir, { recursive: true });

// Read clips.json
const clips = JSON.parse(await fs.readFile(clipsFile, 'utf8'));

console.log(`🎬 Stitching ${clips.length} clips...`);

const extractPromises = clips.map(async (clip, index) => {
  const tempOutput = path.join(tempDir, `clip${index}.mp4`);
  const cmd = `ffmpeg -ss ${clip.start} -i "${clip.file}" -t ${clip.duration} -c:v libx264 -c:a aac -movflags +faststart "${tempOutput}" -y`;

  console.log(`⏱️ Extracting clip ${index + 1}: ${path.basename(clip.file)} [${clip.start}s → +${clip.duration}s]`);
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Failed to extract clip ${index + 1}:`, stderr);
        reject(error);
      } else {
        resolve(`file '${tempOutput.replace(/'/g, "'\\''")}'`);
      }
    });
  });
});

try {
  // Step 1: Extract clips
  const clipList = await Promise.all(extractPromises);

  // Step 2: Write concat-list.txt
  await fs.writeFile(concatListFile, clipList.join('\n'));

  // Step 3: Concatenate
  const finalOutput = path.join(outputDir, 'stitched_output.mp4');
  const concatCmd = `ffmpeg -f concat -safe 0 -i "${concatListFile}" -c copy "${finalOutput}" -y`;

  console.log(`📦 Concatenating clips...`);
  await new Promise((resolve, reject) => {
    exec(concatCmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Failed to concatenate clips:`, stderr);
        reject(error);
      } else {
        console.log(`✅ Final video saved: ${finalOutput}`);
        resolve();
      }
    });
  });

  // Optional: Clean temp
  await fs.rm(tempDir, { recursive: true, force: true });

} catch (err) {
  console.error('🛑 Process failed:', err);
}
