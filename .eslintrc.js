module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // turn on errors for missing imports
    "import/no-unresolved": "error",
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        groups: [
          'builtin',
          ['internal', 'external'],
          ['sibling', 'parent', 'index'],
        ],
        pathGroups: [
          {
            pattern: '@src/**',
            group: 'external',
            position: 'after',
          },
        ],
        alphabetize: {
          // order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      },
    ]
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        // use <root>/path/to/folder/tsconfig.json
        // "project": "tsconfig.json",
        "project": [
          "tsconfig.json",
          "dist/tsconfig.json"
        ]
      }
    }
  },
  // "eslint.workingDirectories": [
  //   { "directory": "./src", "changeProcessCWD": true }
  // ]
};