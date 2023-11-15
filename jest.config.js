module.exports = {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },


    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",

    // An array of file extensions your modules use
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],

    // The paths to modules that run some code to configure or set up the testing environment before each test
    setupFiles: [],

    // The test environment that will be used for testing
    testEnvironment: "node",

    // The glob patterns Jest uses to detect test files
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[tj]s?(x)"
    ],

    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    moduleNameMapper: {
        "^~/(.*)$": "<rootDir>/src/$1",
    },

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ["/node_modules/"],

    // Indicates whether each individual test should be reported during the run
    verbose: true,

    // A preset that is used as a base for Jest's configuration
    preset: null,

};
