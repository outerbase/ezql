import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/ezql.ts',
  output: {
    name: 'EZQL',
    file: 'dist/umd/bundle.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [typescript()],
}
