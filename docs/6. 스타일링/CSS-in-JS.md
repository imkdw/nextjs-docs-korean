# CSS-in-JS

- JS 내부에 CSS 를 추가하는 설정
- 현재 서버 컴포넌트 에서는 CSS-in-JS를 지원하지 않음
- 아래는 클라이언트 컴포넌트와 CSS-in-JS를 지원하는 라이브러리들임
  - chakra-ui
  - kuma-ui
  - @mui/material
  - @mui/joy
  - pandacss
  - styled-jsx
  - styled-components
  - stylex
  - tamagui
  - tss-react
  - vanilla-extract

서버 컴포넌트를 스타일링 하기 위해서는 CSS Module, Tailwind CSS 처럼 실제 CSS 파일을 출력하는 다른 솔루션을 사용 할 것을 권장함

<br/>

# `app`에서 CSS-in-JS 설정하기

1. 렌더링의 모든 CSS 규칙을 수집하는 Style Registry 정의
2. 규칙을 사용할 수 있는 컨텐츠보다 먼저 규칙을 주입하기 위한 `useServerInsertedHTML Hook` 사용
3. 초기 서버 사이드 렌더링 중에 Style Registry로 App을 감싸는 클라이언트 컴포넌트 정의

### `styled-jsx`

- `styled-jsx` 라이브러리를 사용하는 경우 5.1.0 버전을 사용 할 것을 권장

```tsx
"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { StyleRegistry, createStyleRegistry } from "styled-jsx";

export default function StyledJsxRegistry({ children }: { children: React.ReactNode }) {
  // 지연 초기 상태로 스타일시트를 한번만 생성
  // docs : https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>;
}
```

그리고나서 루트 레이아웃을 감쌈

```tsx
import StyledJsxRegistry from "./registry";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
```

<br/>

### Styled Components

- `styled-component` 는 6 또는 그 이상의 버전을 사용하는것을 권장
- 우선 `next.config.ts` 에서 옵션을 활성화함

```ts
module.exports = {
  compiler: {
    styledComponents: true,
  },
};
```

- Styled Component API를 사용해서 렌더링 중 생성된 모든 CSS 스타일 규칙을 수집하는 Global Registry 컴포넌트 및 규칙을 반환하는 함수를 생성
- 그리고 `useServerRInsertedHTML` 훅을 사용해서 Registry에서 수집한 스타일을 루트 레이아웃의 `<head>` 태그에 삽입

```tsx
"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // 지연 초기 상태로 스타일시트를 한번만 생성
  // docs : https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") return <>{children}</>;

  return <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{children}</StyleSheetManager>;
}
```

그리고나서 루트 레이아웃에 Registry Components를 children props로 넘김

```tsx
import StyledComponentsRegistry from "./lib/registry";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
```
