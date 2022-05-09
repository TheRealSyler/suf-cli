import typescript from '@rollup/plugin-typescript';
import hashbang from "rollup-plugin-hashbang";
import { RollupOptions } from "rollup";

const bundle: RollupOptions = {
  input: 'src/index.ts',
  output: {
    dir: './dist',
    format: 'cjs'
  },
  external: ["fs", "suf-node", "path", "suf-log", "node-fetch", "typescript"],
  plugins: [typescript(), hashbang()]
}
export default bundle