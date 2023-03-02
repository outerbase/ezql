import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/lib/index.ts',
  output: {
    name: 'Outerbase',
    file: 'dist/umd/bundle.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [typescript({ tsconfig: 'config/tsconfig.umd.json' })],
}
