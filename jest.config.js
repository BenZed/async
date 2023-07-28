/* eslint-env node */
module.exports = {
    roots: ['./src'],
    modulePathIgnorePatterns: ['.util.test.ts'],
    coveragePathIgnorePatterns: ['test-dir'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: './tsconfig.json'
            }
        ]
    }
}
