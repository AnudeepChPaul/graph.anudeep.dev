module.exports = {
  root: true
  , parser: '@typescript-eslint/parser'
  , plugins: [ '@typescript-eslint' ]
  , extends: [ 'eslint:recommended', 'plugin:@typescript-eslint/recommended' ]
  , rules: {
    'semi': [ 'error', 'never' ]
    , 'quotes': [ 'error', 'single' ]
    , 'comma-style': [ 'error', 'first' ]
    , 'comma-dangle': [ 'error', 'never' ]
    , 'comma-spacing': [ 'error', { 'before': false, 'after': true } ]
    , 'curly': [ 'error', 'multi-line' ]
    , 'array-bracket-newline': [
      'error'
      , {
        'multiline': true
      }
    ]
    , 'array-bracket-spacing': [ 'error', 'always' ]
    , 'object-curly-spacing': [ 'error', 'always' ]
    , 'array-element-newline': [
      'error'
      , {
        'multiline': true
        , 'minItems': 3
      }
    ]
    , 'camelcase': [ 'error', { 'properties': 'always' } ]
    , 'indent': [ 'error', 2 ]
    , 'no-unused-expressions': [ 'error', { 'allowTernary': true, 'allowShortCircuit': true, 'allowTaggedTemplates': true } ]
    , '@typescript-eslint/no-explicit-any': 'off'
    , '@typescript-eslint/explicit-module-boundary-types': 0
    , '@typescript-eslint/no-var-requires': 0
  }
  , 'env': {
    'es6': true
    , 'node': true
  }
  , ignorePatterns: [
    '/generated/*'
    , '/output/*'
    , '/scripts/*'
    , 'react*.*'
  ]
}