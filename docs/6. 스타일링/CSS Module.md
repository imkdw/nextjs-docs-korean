# CSS Modules

- Next.js는 `.module.css` 확장자를 사용하는 CSS 모듈을 기본적으로 제공해준다
- CSS Module은 고유한 클래스를 자동으로 생성해서 CSS를 로컬 범위로 지정한다
- 클래스명 충돌 등 걱정없이 여러개의 파일에서 동일한 이름의 클래스를 사용할 수 있다
- 이러한 특성으로 인해서 CSS 모듈은 컴포넌트 수준의 CSS를 포함하기에 좋다

<br/>

# 예시

- CSS Module은 App 폴더 내의 모든 파일로 가져올 수 있다

```tsx
import styles from "./styles.module.css";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <section className={styles.dashboard}>{children}</section>;
}
```

```css
.dashboard {
  padding: 24px;
}
```

CSS 모듈은 확장자가 `.module.css` 또는 `.module.sass` 인 파일에서만 활성화된다

프로덕션 환경에서는 모든 CSS Module 파일들은 여러개의 축소되고 코드로 분할된 .css 파일로 연결된다

이러면 .css 파일은 웹의 DOM 요소가 페인팅될때 최소한의 CSS로만 로딩된다

<br/>

# 글로벌 스타일 정의

- 글로벌 스타일은 App 폴더 내부의 레이아웃, 페이지 또는 컴포넌트 내부에서 사용이 가능하다
- 아래는 `app/global.css` 파일이다

```css
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

`app/layout.ts` 에서 `global.css` 를 import 하면 모든 하위 경로에 스타일이 적용된다

```tsx
import "./global.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

<br/>

# 외부 스타일

- 외부 패키지에 의해서 배포된 스타일은 App 폴더 내부 어디에서나 사용이 가능하다

```tsx
import "bootstrap/dist/css/bootstrap.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  );
}
```

<br/>

# CSS가 병합되는 순서

- Next.js는 CSS 파일에 대해서 자동으로 병합하여 프로덕션 빌드중에 CSS를 최적화함
- CSS가 적용되는 순서는 CSS를 로딩하는 순서에 따라서 결정됨
- 아래 에시는 `<BaseButton>`이 `<Page>`보다 먼저 가져오기 때문에 `base-button.module.css`는 `page.module.css`보다 먼저 적용됨

```tsx
import styles from "./base-button.module.css";
export function BaseButton() {
  return <button className={styles.primary} />;
}
```

```tsx
import { BaseButton } from "./base-button";
import styles from "./page.module.css";
export function Page() {
  return <BaseButton className={styles.primary} />;
}
```

- CSS의 로딩 순서를 예측 할려면 아래 단계를 따르는것을 권장
  - CSS 파일은 단일 JS/TS 파일로 가져오기
  - 전역 클래스를 사용하는 경우에는 동일한 파일에 있는 글로벌 스타일을 적용하려는 순서대로 가져옴
- 글로벌 스타일 정의보다는 CSS 모듈을 사용하자
- 공유 스타일을 별도의 컴포넌트로 추출하기
- Tailwind를 사용하는 경우는 루트 레이아웃에서 CSS 가져오기

<br/>

# 추가 기능

- Next.js는 스타일을 위한 추가 기능을 제공해줌
- 로컬에서 개발환경으로 실행하는 경우는 스타일이 변경되면 즉시 적용되어 보여짐
- `next build` 를 통한 프로덕션 빌드시 CSS를 다운로드하는 네트워크 요청수를 줄이기 위해서 더 적은 수의 축소된 .css 파일로 번들링됨
- 개발자도구에서 `disable javascript` 를 하더라도 스타일은 계속 로드됨. 하지만 빠른 새로고침을 위해서는 자바스크립트를 활성화 시켜놔야함
