module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    // 'airbnb-base',
    // '@vue/prettier',
    '@vue/typescript',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~', './src'],
          ['@', './src'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue', '.d.ts'],
      },
    },
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    // 一个函数的嵌套不能超过 3 层，多个 for 循环，深层的 if-else，都是罪恶之源
    'max-depth': [2, 3],
    // 一个函数最多有 2 层 callback，使用 async/await
    'max-nested-callbacks': [2, 2],
    // 一个文件的最大行数
    'max-lines': [2, { max: 1000 }],
    // 一个函数最多 3 个参数。参数太多的函数，意味着函数功能过于复杂，请拆分吧
    'max-params': [2, 3],
    semi: [2, 'never'],

    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/no-extraneous-dependencies': 1,
  },
}
