import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import image from 'rollup-plugin-images'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

export default defineConfig({
    input: 'src/renderer/app.tsx',
    output: {
        dir: 'dist/renderer-bundle',
        format: 'cjs',
        sourcemap: false,
    },
    plugins: [
        html(),
        postcss({
            extract: false,
            use: ['sass'],
            sourceMap: false
        }),
        image({
            limit: 10000,
        }),
        json(),
        typescript({
            tsconfig: './tsconfig-rollup.json',
        }),
        commonjs(),
        resolve()
    ],
    external: [
        'electron',
        'electron/main',
        'electron/common',
        'electron/renderer',
        'electron-log',
        'crypto',
        'electron-unhandled',
        '@electron/remote',
        'original-fs',
    ]
})
