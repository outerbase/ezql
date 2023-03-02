import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

const outputOpts = {
  name: 'Outerbase',
  file: 'dist/umd/bundle.js',
  format: 'umd',
  sourcemap: true,
}

export default {
  input: 'src/lib/index.ts',
  output: [outputOpts, { ...outputOpts, file: 'dist/umd/bundle.min.js', sourcemap: false, plugins: [terser()] }],
  plugins: [typescript({ tsconfig: 'config/tsconfig.umd.json' })],
}
