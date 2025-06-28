import { exec } from 'child_process';
import path from 'path';

const inputPath = '/home/carmaine/Рабочий стол/nodejs-practice/nodejs-practice/shinobi/output/stitched_output.mp4';
const outputPath = './output/video_with_text.mp4';

// Text overlay parameters
const overlayText = 'Motion Detected!';
const startTime = 5;      // in seconds
const duration = 3;       // in seconds

// Font and position settings
const fontSize = 32;
const fontColor = 'blue';
const boxColor = 'black@0.5';
const fontFile = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; // Update path as needed

// Expression: 'between(t,start,end)' controls visibility
const drawtextFilter = `drawtext=fontfile='${fontFile}':text='${overlayText}':fontcolor=${fontColor}:fontsize=${fontSize}:box=1:boxcolor=${boxColor}:boxborderw=5:x=(w-text_w)/2:y=h-th-50:enable='between(t,${startTime},${startTime + duration})'`;

const cmd = `ffmpeg -i "${inputPath}" -vf "${drawtextFilter}" -c:a copy "${outputPath}"`;

console.log('🎬 Adding text overlay...');
exec(cmd, (err, stdout, stderr) => {
  if (err) {
    console.error('❌ Failed to overlay text:', stderr);
  } else {
    console.log(`✅ Text overlay added: ${outputPath}`);
  }
});
