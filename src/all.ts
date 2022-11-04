import type { Plugin } from 'vite';
import type { NormalizedOutputOptions, OutputBundle } from 'rollup';

export default function vitePluginVueStyleInline(): Plugin {
    return {
        name: 'vite-plugin-vue-style-inline',
        apply: 'build',
        enforce: 'post',
        generateBundle(
            options: NormalizedOutputOptions,
            bundle: OutputBundle,
            isWrite: boolean
        ) {
            let buffer = '';
            for (const key in bundle) {
                const chunk = bundle[key];
                if (chunk.type === 'asset' && chunk.fileName.endsWith('.css')) {
                    buffer += chunk.source as string;
                    delete bundle[key];
                }
            }

            const styleCode = JSON.stringify(buffer.trim());
            for (const key in bundle) {
                const chunk = bundle[key];
                if (
                    chunk.type === 'chunk' &&
                    /\.[cm]?js$/.test(chunk.fileName) &&
                    !chunk.fileName.includes('polyfill')
                ) {
                    const rawCode = chunk.code;
                    chunk.code = `(function() {
                        try {
                            var styleElement = document.createElement('style');
                            styleElement.innerText = ${styleCode};
                            document.head.appendChild(styleElement);
                        } catch(e) {
                            console.error('vite-plugin-vue-style-inline', e);
                        }
                    })(); ${rawCode}`;
                    break;
                }
            }
        },
    };
}