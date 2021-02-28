module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    node: true,
    browser: true,
    es2020: true
  },
  plugins: ['svelte3', '@typescript-eslint'],
  extends: ['standard'],
  overrides: [
    {
      files: ['*.svelte'],
      plugins: ['svelte3'],
      processor: 'svelte3/svelte3',
      rules: {
        'import/first': 'off',
        'import/no-duplicates': 'off',
        'import/no-mutable-exports': 'off',
        'import/no-unresolved': 'off',
        'no-multiple-empty-lines': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off'
      }
    }
  ],
  settings: {
    'svelte3/typescript': require('typescript')
  }
}
