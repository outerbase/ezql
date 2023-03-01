import { copyFile } from 'fs/promises'
import Path from 'node:path'
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export async function copyAssets() {
  // copy ../dist/umd/bundle.* to ./web/
  const assetPath = Path.join(__dirname, '..', 'dist', 'umd')
  const bundlePath = Path.join(assetPath, 'bundle.js')
  const bundleMapPath = Path.join(assetPath, 'bundle.js.map')
  return Promise.all([
    copyFile(bundlePath, Path.join(__dirname, 'web', 'bundle.js')),
    copyFile(bundleMapPath, Path.join(__dirname, 'web', 'bundle.map.js')),
  ])
}

copyAssets().catch((err) => {
  console.error(err)
  process.exit(1)
})
