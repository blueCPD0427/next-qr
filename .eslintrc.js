// eslintフォーマットコマンド
// npx prettier --write .
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
    ],
    plugins: ['prettier', '@typescript-eslint'],
    rules: {
        'prettier/prettier': 'error',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
    },
    overrides: [
        {
            files: ['app/lib/prisma.ts'],
            rules: {
                'no-var': 'off',
            },
        },
        {
            files: ['components/ui/**/*.tsx'],
            rules: {
                'react/prop-types': 'off',
            },
        },
        {
            files: ['components/ui/**/*.tsx'],
            rules: {
                '@typescript-eslint/no-empty-object-type': 'off',
            },
        },
    ],
};
