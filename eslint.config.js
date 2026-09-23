// ESLint flat config
// eslint 10 (v9~ 부터 flat config만 지원) 으로 .eslintrc / .eslintignore 를 이관함.
//
// - ignores: 이전에 .eslintignore 에 있던 제외 목록
// - files:   빌드 대상 소스(src) 에만 규칙 적용 (.eslintrc 의 rules 동일)

module.exports = [
    {
        ignores: [
            'dist/**',
            'umd/**',
            'demo/**',
            'test/**',
            'build/**',
            'node_modules/**',
            '**/*.min.js',
        '*.js',
        '*.ts',
       ],
     },
      {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
        },
        rules: {
             'quotes': ['error', 'single'],
             'indent': ['error', 4],
             // 'comma-dangle': 'always' 문자열은 arrow 함수 파라미터/콜 인자에
             // trailing comma(예: text, =>)를 자동 삽입해 소스를 파손시키므로,
             // objects/arrays 는 항상 요구하되 functions 은 'never' 로 지정.
             'comma-dangle': ['error', {
                  arrays: 'always',
                  objects: 'always',
                  imports: 'always',
                  exports: 'always',
                  functions: 'never',
              }],
        },
     },
];
