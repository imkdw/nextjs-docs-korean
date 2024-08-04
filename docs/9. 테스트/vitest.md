# 빠른 시작

`create-next-app` 을 통해서 `with-vitest` 템플릿으로 빠르게 구성이 가능함

```bash
npx create-next-app@latest --example with-vitest with-vitest-app
```

<br/>

# 수동 설치

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react
# or
yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react
# or
pnpm install -D vitest @vitejs/plugin-react jsdom @testing-library/react
# or
bun add -D vitest @vitejs/plugin-react jsdom @testing-library/react
```

설치가완료되면 `vitest.config.ts` 파일을 루트경로에 생성함

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
});
```

그리고 `package.json` 내부에 테스트 스크립트를 정의함

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest"
  }
}
```

이후에 `npm run test`를 하게되면 vitest가 변경되는 사항을 감지함

<br/>

# vitest로 단위테스트 만들기

- 아래 예시는 `<Page>` 컴포넌트가 제목을 잘 렌더링 하는지 테스트한다

```tsx
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  );
}
```

```tsx
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

test("Page", () => {
  render(<Page />);
  expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
});
```
