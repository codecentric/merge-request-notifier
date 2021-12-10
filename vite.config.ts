import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjsExternals from 'vite-plugin-commonjs-externals';
import electron from 'vitejs-plugin-electron'
import builtinModules from 'builtin-modules';

const commonjsPackages = [
    'electron',
    'electron/main',
    'electron/common',
    'electron/renderer',
    'electron-log',
    'electron-unhandled',
    '@electron/remote',
    'original-fs',
    ...builtinModules,
] as const;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        commonjsExternals({
            externals: commonjsPackages,
        }),
    ],
    optimizeDeps: {
        entries: [
            'src/renderer/**',
            'src/share/**'
        ]
    },
    server: {
        port: 2003,
        strictPort: true,
    },
})
