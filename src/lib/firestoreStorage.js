import { resizeAndCompressImage, estimateDataUrlBytes } from './imageUtils.js'

const MAX_AVATAR_BYTES = 100 * 1024 // ~100KB after compression
const MAX_SCREENSHOT_BYTES = 350 * 1024 // ~350KB after compression

/**
 * "Uploads" a project screenshot — really, compresses it client-side and
 * returns a base64 data URL to store directly in the project's Firestore
 * document. No Firebase Storage involved, so this works on the free Spark
 * plan (Storage now requires the paid Blaze plan even to enable).
 */
export async function uploadProjectScreenshot(userId, file) {
  const dataUrl = await resizeAndCompressImage(file, { maxWidth: 900, quality: 0.6 })
  if (estimateDataUrlBytes(dataUrl) > MAX_SCREENSHOT_BYTES) {
    throw new Error('Image is too large even after compression. Try a smaller or simpler image.')
  }
  return dataUrl
}

/**
 * Same idea for avatars, compressed smaller since they display much smaller
 * on screen.
 */
export async function uploadAvatar(userId, file) {
  const dataUrl = await resizeAndCompressImage(file, { maxWidth: 300, quality: 0.7 })
  if (estimateDataUrlBytes(dataUrl) > MAX_AVATAR_BYTES) {
    throw new Error('Image is too large even after compression. Try a smaller or simpler image.')
  }
  return dataUrl
}
