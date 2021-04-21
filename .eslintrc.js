module.exports = {
    root: true,
    env: {
        es6: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2019, // Node.js 12の場合は2019、他のバージョンのNode.jsを利用している場合は場合は適宜変更する
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.eslint.json']
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
        'prettier/@typescript-eslint'
    ],
    rules: {
        '@typescript-eslint/ban-types': [
            2,
            {
                types: {
                    object: 'Do not use object',
                    Object: 'Do not use object'
                }
            }
        ],
        '@typescript-eslint/camelcase': [0],
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/interface-name-prefix': [0, 'never'],
        '@typescript-eslint/member-delimiter-style': [
            2,
            { multiline: { delimiter: 'none' } }
        ],
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/no-explicit-any': 1,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/prefer-regexp-exec': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/no-unsafe-call': 0,
        '@typescript-eslint/no-unsafe-assignment': 0,
        'arrow-parens': [2, 'as-needed'],
        'brace-style': [0, 'never'],
        'comma-dangle': [2, 'never'],
        curly: [2, 'all'],
        'import/order': [2, { 'newlines-between': 'never' }],
        indent: [1, 4, { SwitchCase: 1 }],
        'lines-between-class-members': 0,
        'max-len': [
            1,
            {
                code: 120,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true
            }
        ],
        'new-parens': 2,
        'no-console': [1, { allow: ['warn', 'error', 'info'] }],
        'no-irregular-whitespace': 1,
        'no-multiple-empty-lines': [1, { max: 1 }],
        'no-new': 0,
        'no-trailing-spaces': 1,
        'no-unused-expressions': 0,
        'no-undef-init': 'error',
        'no-var': 2,
        'object-shorthand': 2,
        'object-curly-newline': [
            1,
            {
                ObjectExpression: {
                    multiline: true,
                    minProperties: 4,
                    consistent: true
                }
            }
        ],
        'object-curly-spacing': [1, 'always'],
        'one-var-declaration-per-line': 2,
        'padded-blocks': 0,
        'prefer-arrow-callback': 2,
        'prefer-const': 2,
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        quotes: [2, 'single', { allowTemplateLiterals: true }],
        'require-await': 1,
        semi: [2, 'never'],
        'space-before-function-paren': [0, 'never']
    }
}
