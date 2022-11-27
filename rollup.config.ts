import { RollupOptions } from "rollup";
import dts from "rollup-plugin-dts";
import hashbang from "rollup-plugin-hashbang";
import { swc } from 'rollup-plugin-swc3';

const configs: RollupOptions[] = [
  {
    input: [
      "src/cli.ts",
      "src/index.ts",
    ],
    output: {
      dir: './dist',
      format: 'cjs'
    },
    external: ["fs", "suf-node", "path", "suf-log", "node-fetch", "typescript"],
    plugins: [swc(), hashbang()]
  },
  {
    input: 'src/index.ts',
    output: {
      dir: './dist',
      format: 'cjs'
    },
    external: ["fs", "suf-node", "path", "suf-log", "node-fetch", "typescript"],
    plugins: [dts()]
  }
]
export default configs