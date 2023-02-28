import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: {
    name: 'Outerbase',
    file: 'dist/umd/bundle.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [typescript()],
}
