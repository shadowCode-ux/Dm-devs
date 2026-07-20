/**
 * Resizes and compresses an image file entirely in the browser (via canvas),
 * then returns it as a base64 data URL. This lets us store images directly
 * in Firestore documents — no Firebase Storage (and therefore no paid Blaze
 * plan) required.
 *
 * Firestore documents are capped at 1MB, so we keep results well under that:
 * avatars target under ~80KB, screenshots under ~300KB.
 */
export function resizeAndCompressImage(file, { maxWidth, quality }) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = () => {
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // JPEG compresses far better than PNG for photos/screenshots.
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Rough byte size of a base64 data URL — used to warn if an image is still
 * too large after compression (e.g. a very large or complex source image).
 */
export function estimateDataUrlBytes(dataUrl) {
  const base64 = dataUrl.split(',')[1] || ''
  return Math.floor((base64.length * 3) / 4)
}
