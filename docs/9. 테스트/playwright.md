# Playwright

- 크로미움, 파이어폭스, 웹킷 자동화가 가능한 테스트 프레임워크
- E2E 테스트 작성이 가능함

<br/>

# 빠른시작

`create-next-app` 을 통해서 `with-playwright` 템플릿으로 빠르게 구성이 가능함

```bash
npx create-next-app@latest --example with-playwright with-playwright-app
```

<br/>

# 수동설정

```bash
npm init playwright
# or
yarn create playwright
# or
pnpm create playwright
```

이후에 playwright.config.ts를 통해서 설정이 가능함

<br/>

# Playwright 테스트 만들기

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
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>About</h1>
      <Link href="/">Home</Link>
    </div>
  );
}
```

이후에 탐색이 정상적으로 이루어지는지 검사함

```ts
import { test, expect } from "@playwright/test";

test("should navigate to the about page", async ({ page }) => {
  // 맨 처음 페이지에서 시작함
  await page.goto("http://localhost:3000/");
  // text가 about인 엘리먼트를 찾고 그 엘리먼트를 클릭함
  await page.click("text=About");
  // 클릭 이후에는 페이지가 /about 이여야함
  await expect(page).toHaveURL("http://localhost:3000/about");
  // h1 요소에 About 텍스트가 있어야함
  await expect(page.locator("h1")).toContainText("About");
});
```

### Playwright 테스트 실행

Playwright는 3가지 테스트 실행 방법을 지원함

- Chromium
- Firefox
- Webket

- 테스트를 위해서는 Next.js 서버가 실행중인 상태여야함
- 실제 앱이 작동하는걸 테스트하기 위해서 프로덕션 코드에 대해 테스트를 하는게 좋음
- 터미널에서 `npm run build`, `npm run start`를 한 뒤에 `npx playwright test`를 입력하면됨

### CI 파이프라인에서 테스트

- 기본적으로 headless 모드를 지원함
- playwright의 모든 종속성을 설치할려면 npx playwright install-deps를 하면됨
