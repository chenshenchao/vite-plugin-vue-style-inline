import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    entries: [
        "./src/all"
    ],
    outDir: "dist",
    declaration: true,
    clean: true,
    rollup: {
        emitCJS: true,
    }
});