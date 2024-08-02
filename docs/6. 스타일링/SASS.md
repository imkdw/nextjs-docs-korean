# Sass

- Next.js는 `.scss`, `.sass` 확장자를 모두 사용하는 패키지를 설치하고나서 Sass와의 통합을 기본적으로 지원함
- CSS Module과 `.module.scss`, `.module.sass` 확장자를 가진 스타일시트를 통해 컴포넌트 수준의 Sass 사용이 가능함

### Sass 설치

```bash
npm install --save-dev sass
```

<br/>

# Sass 옵션 커스텀하기

- 만약 옵션을 커스텀 해야하는 경우 `next.config.ts` 에다가 `sassOptions` 를 사용함

```ts
const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};
```

<br/>

# Sass 사용

- Next.js는 CSS Module에서 반환된 sass 변수 사용을 지원함

```scss
$primary-color: #64ff00;

:export {
  primaryColor: $primary-color;
}
```

```tsx
import variables from "./variables.module.scss";

export default function Page() {
  return <h1 style={{ color: variables.primaryColor }}>Hello, Next.js!</h1>;
}
```
