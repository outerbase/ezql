import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/lib/ezql.ts',
  output: {
    name: 'Outerbase',
    file: 'dist/umd/bundle.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [typescript({ exclude: ['src/cli/**/*'] })],
}
