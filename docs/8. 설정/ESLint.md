# ESLint

- Next.js는 바로 사용이 가능한 ESLint 환경을 제공함
- `npm run lint`를 통해서 린트 검사가 가능함

만약 기존에 ESLint 설정이 되어있지 않다면 위 명령어 입력시 아래 프로세스가 진행됨

```bash
You'll see a prompt like this:

? How would you like to configure ESLint?

❯ Strict (recommended)
Base
Cancel
```

### Strict 설정

- 보다 엄격한 웹 바이탈 규칙과 함께 Next.js의 기본 ESLint 구성을 포함
- ESLint를 처음 설정하는 개발자에게 적합함

```json
{
  "extends": "next/core-web-vitals"
}
```

<br/>

### Base 설정

- Next.js의 기본 ESLint 설정을 포함

```json
{
  "extends": "next"
}
```

<br/>

### Cancel

- 직접 ESLint 설정을 할려고 하는경우에만 이 옵션을 선택함

Strict 또는 Base 옵션을 선택하게되면 Next.js가 앱의 종속성으로 eslint, eslint-confing-next를 자동으로 설치하고 .eslintrc.json 파일을 생성함

린트는 `next build` 시에도 자동으로 검사함

오류가 발생하면 빌드가 실패하지만 경고가 발생하면 빌드는 실패하지 않음

<br/>

# ESLint 설정

- 기본으로 포함된 `eslint-config-next`에는 Next.js의 최적화된 Lint를 구현하는데 필요한 모든게 포함되어있다
- 아래 플러그인들은 `eslint-config-next` 내에서 사용됨
  - eslint-plugin-react
  - eslint-plugin-react-hooks
  - eslint-plugin-next

위 설정들은 `next.config.ts` 보다 우선순위가 높음

<br/>

# ESLint 플러그인

- Next.js는 기본 구성에 이미 번들로 제공되는 ESLint 플러그인 `eslint-plugin-next`를 제공해서 일반적인 이슈와 문제를 확인할 수 있음
- 아래는 모든 규칙들임, 항목이 많아서 링크로 대체

DOCS : https://nextjs.org/docs/app/building-your-application/configuring/eslint#eslint-plugin

### 커스텀 설정

#### `rootDir`

- 모노레포 등 Next.js가 루트 프로젝트에 설치되지 않은 프로젝트에서 `eslint-plugin-next`를 사용하는 경우 .eslintrc의 설정 속성을 사용해서 Next.js 프로젝트의 위치를 `eslint-plugin-next`에 지정이 가능함

```json
{
  "extends": "next",
  "settings": {
    "next": {
      "rootDir": "packages/my-app/"
    }
  }
}
```

<br/>

# 커스텀 폴더와 파일 린팅하기

- 기본적으로 Next.js는 `pages/`, `app/`, `components/`, `lib/`, `src/` 폴더에 있는 모든 파일에 대해서 린트를 검사함
- 하지만 프로덕션 빌드의 경우 `next.config.ts`의 eslint 구성에서 `dirs` 옵션을 사용해서 실행할 폴더 지정이 가능함

```ts
module.exports = {
  eslint: {
    // next build시 아래 폴더에 대해서만 린트를 한다는 설정
    dirs: ["pages", "utils"],
  },
};
```

또한 `next lint` 명령어에 플래그를 지정해서도 가능하다

```bash
next lint --dir pages --dir utils --file bar.js
```

<br/>

# 캐싱

- 성능향상을 위해서 ESLint에서 처리한 파일 정보는 기본적으로 캐싱됨
- 기본적으로 `.next/cache`에 생성되며 저장위치는 커스텀이 가능함
- 캐시를 비활성화 해야하는 경우는 `--no-cache` 플래그를 사용함

```bash
next lint --no-cache
```

<br/>

# 규칙 비활성화

- 플러그인 내부에서 지원하는 규칙에 대해서 수정 또는 비활성화 할려면 `.eslintrc`의 규칙 속성을 직접 변경할 수 있음

```json
{
  "extends": "next",
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

### 코어 웹 바이탈

- `next/lint`를 통해서 린트가 처음 실행되면 `next/core-web-vitals` 규칙이 설정되고 strict 모드가 설정됨

```json
{
  "extends": "next/core-web-vitals"
}
```

`next/core-web-vital`은 코어 웹 바이탈에 영향을 미치는 경우 기본적으로 경고하는 여러 규칙에 대한 에러를 `eslint-plugin-next`로 업데이트함

또한 기본적으로 `create next app`을 통해서 만든 프로젝트는 자동으로 포함됨

<br/>

# 다른 도구와 같이 사용하기

### Prettier

- ESLint는 코드작성 규칙이 포함되어 있어서 기존 Prettier 설정과 충돌이 날 수도 있음
- ESLint랑 Prettier가 같이 작동하도록 ESLint 구성에 `eslint-config-prettier`를 포함하는것이 좋음

```bash
npm install --save-dev eslint-config-prettier

yarn add --dev eslint-config-prettier

pnpm add --save-dev eslint-config-prettier

bun add --dev eslint-config-prettier
```

패키지 설치가 완료되면 ESLint 설정에 추가함

```json
{
  "extends": ["next", "prettier"]
}
```

<br/>

### lint-staged

- lint-staged와 함께 `next lint`를 사용할려면 `.lintstagedrc.js` 파일에 아래 file 플래그를 추가한다

```js
const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],
};
```

<br/>

# 기존에 존재하는 컨피그 마이그레이션

### Rulset 플러그인 추천

이미 ESLint가 구성되어 있고 아래 조건중에 하나라도 해당되는 경우 추천함

- 아래 플러그인 중 하나 이상이 이미 설치되어 있을때(airbnb나 react 같은 다른 구성을 통해서)
  - react
  - react-hooks
  - jsx-a11y
  - import
- Next.js에서 Babel이 구성되는 방식과 다른 특정 parserOptions를 정의한 경우(Babel 설정을 커스텀하지 않는 경우 권장되지 않음)
- Node.js 또는 TS resolver가 eslint-plugin-import가 설치되어 있는 경우

이러한 속성들을 `eslint-config-next` 내부에서 구성한 방식을 선호하는 경우 설정을 제거하거나, Next.js ESLint 플러그인에서 직접 확장하는게 좋음

```json
module.exports = {
  extends: [
    //...
    'plugin:@next/next/recommended',
  ],
}
```

```bash
npm install --save-dev @next/eslint-plugin-next

yarn add --dev @next/eslint-plugin-next

pnpm add --save-dev @next/eslint-plugin-next

bun add --dev @next/eslint-plugin-next
```

위 방법대로 진행하면 여러개의 구성 파일에서 동일한 플러그인이나 파서를 가져올때 발생할 수 있는 충돌이나 오류를 방지할 수 있음

<br/>

### 추가 설정들

- 이미 별도의 ESLint 설정을 사용하고 있고, `eslint-config-next`를 포함하려는 경우 다른 구성 다음에 마지막으로 확장해야함

```json
{
  "extends": ["eslint:recommended", "next"]
}
```

`next` 플러그인은 parser, plugin, settings 등을 이미 처리하고 있음

케이스에 따라서 다른 구성이 필요하지 않는 한 이러한 속성을 수동으로 또 선언한 필요는 없음
