export default {
    build: {
        artifactsDir: "dist",
        ignoreFiles: [
            "test/**",
            "utils/**",
            ".claude/**",
            "dist/**",
            "*.zip",
            ".prettierrc",
            "README.md",
            "Makefile",
            "CLAUDE.md",
            "build.config.json",
            "web-ext-config.mjs",
        ],
    },
};
