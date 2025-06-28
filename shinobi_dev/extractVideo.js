import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'

// INPUT CONFIG
const GROUP_KEY = 'YaAwVC1GPU'
const MONITOR_ID = '2a6n2o9b0i8t'
const START = '2025-06-22T00:37:20' // ISO format
const END = '2025-06-22T00:37:25'
const BASE_DIR = `/home/Shinobi/videos/${GROUP_KEY}/${MONITOR_ID}`

// OUTPUT
const OUTPUT_FILE = './output/clipped_segment.mp4'

// Helpers
function parseDate(dateStr) {
  return new Date(dateStr).getTime()
}

function parseFilenameToTimestamp(filename) {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})\.mp4$/)
  if (!match) return null
  const [_, year, month, day, hour, minute, second] = match
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).getTime()
}

function findMatchingVideos(startMs, endMs) {
  const files = fs.readdirSync(BASE_DIR)
  const mp4Files = files.filter(file => file.endsWith('.mp4'))
  return mp4Files.filter(file => {
    const fileMs = parseFilenameToTimestamp(file)
    if (!fileMs) return false
    return fileMs <= startMs && fileMs + 60_000 >= endMs // assume video file is ~60s long
  })
}

function clipVideo(inputPath, startOffset, duration, outputPath) {
  const fastCmd = `ffmpeg -ss ${startOffset} -i "${inputPath}" -t ${duration} -c copy "${outputPath}"`
  console.log(`🎬 Clipping from ${path.basename(inputPath)} starting at ${startOffset}s for ${duration}s`)
  console.log('Running:', fastCmd)

  exec(fastCmd, (error, stdout, stderr) => {
    if (error) {
      console.warn('⚠️ Fast method failed. Retrying with re-encoding...')
      const fallbackCmd = `ffmpeg -ss ${startOffset} -i "${inputPath}" -t ${duration} -c:v libx264 -c:a aac -movflags +faststart "${outputPath}"`
      console.log('Running fallback:', fallbackCmd)
      exec(fallbackCmd, (fallbackError, fbOut, fbErr) => {
        if (fallbackError) {
          console.error('❌ Both methods failed. Details:')
          console.error(fbErr)
        } else {
          console.log('✅ Clip saved via fallback method:', outputPath)
        }
      })
    } else {
      console.log('✅ Clip saved successfully:', outputPath)
    }
  })
}

// MAIN
const startMs = parseDate(START)
const endMs = parseDate(END)
const matches = findMatchingVideos(startMs, endMs)

if (!matches.length) {
  console.log('❌ No video file found in specified range.')
} else {
  const file = matches[0]
  const fileTimestamp = parseFilenameToTimestamp(file)
  const startOffset = (startMs - fileTimestamp) / 1000
  const duration = (endMs - startMs) / 1000
  const inputPath = path.join(BASE_DIR, file)

  clipVideo(inputPath, startOffset, duration, OUTPUT_FILE)
}
