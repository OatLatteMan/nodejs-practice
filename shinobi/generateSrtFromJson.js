// generateSrtFromJson.js

import fs from 'fs/promises';
import path from 'path';

/**
 * Converts seconds to SRT time format: hh:mm:ss,SSS
 */
function formatSrtTime(seconds) {
  const date = new Date(0);
  date.setSeconds(Math.floor(seconds));
  date.setMilliseconds((seconds % 1) * 1000);
  return date.toISOString().substr(11, 12).replace('.', ',');
}

async function generateSrtFromJson(jsonPath, outputPath) {
  try {
    const jsonData = await fs.readFile(jsonPath, 'utf-8');
    const overlays = JSON.parse(jsonData);

    const srtLines = overlays.map((item, index) => {
      const start = formatSrtTime(item.start);
      const end = formatSrtTime(item.end);
      const text = item.text.trim();

      return `${index + 1}\n${start} --> ${end}\n${text}\n`;
    });

    const finalSrt = srtLines.join('\n');
    await fs.writeFile(outputPath, finalSrt);

    console.log(`✅ Subtitles written to ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to generate SRT:', error.message);
  }
}

// Example usage
const inputJson = path.join('textOverlaysEnhanced.json');
const outputSrt = path.join('output', 'subtitles.srt');
generateSrtFromJson(inputJson, outputSrt);
