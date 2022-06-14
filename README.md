# tsc-project
Node.js, Typescript 를 기반으로 하는 기본 베이스 템플릿

## Installation
```
npm ci
```

## Feature
- Minimal
- TypeScript v4
- Linting with Eslint and Prettier
- Pre-commit hooks with Husky
- Local development with Nodemon

## Scripts
### `npm run start:dev`
`nodemon`과 `ts-node`를 이용하여 development 모드로 프로그램 실행

### `npm run start`
프로그램을 production으로 빌드하고 `build/index.js` 를 실행한다.

### `npm run build`
프로그램을 production으로 빌드함. 해당 파일은 `build/*.js`로 컴파일된다.

### `npm run prettier-format`
코드를 포맷팅한다.
