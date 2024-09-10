// eslintフォーマットコマンド
// npx prettier --write .
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
    ],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        // 他のルールをここに追加
    },
};
