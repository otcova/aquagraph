import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, optimizeDeps } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    optimizeDeps: {
        exclude: [
            "box2d-wasm",
        ],
    },
});
