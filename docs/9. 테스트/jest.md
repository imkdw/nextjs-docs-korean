# 빠른 시작

`create-next-app` 을 통해서 `with-jest` 템플릿으로 빠르게 구성이 가능함

```bash
npx create-next-app@latest --example with-jest with-jest-app
```

<br/>

# 수동 설치

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
# or
yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
# or
pnpm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

설치가 완료되면 jest init 을 통해서 설정 파일을 추가함

```bash
npm init jest@latest
# or
yarn create jest@latest
# or
pnpm create jest@latest
```

```ts
// jest.config.ts
import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // next.config.ts랑 .env가 존재하는 위치를 지정함
  dir: "./",
});

// Jest 관련 추가 설정
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
};

export default createJestConfig(config);
```

`next/jest` 는 자동으로 일부 설정을 해줌

- `transform`을 Next.js 컴파일러를 설정
- `.css`, `.module.css`, 이미지, `next/font` 등을 모킹해줌
- `.env` 파일 불러오기
- `node_modules` 폴더를 테스트에서 제외
- `.next` 폴더를 테스트에서 제외
- `next.config.ts` 에서 SWC를 사용한 테스트 활성화

<br/>

# 절대경로 불러오기와 모듈 경로 별칭(옵셔널)

- 만약 프로젝트가 모듈 경로 별칭을 사용하는 경우 `tsconfig.json` 파일과 `jest.config.ts` 파일의 `moduleNameMapper` 옵션과 일치시켜줘야함

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "baseUrl": "./",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

```ts
moduleNameMapper: {
  // ...
  '^@/components/(.*)$': '<rootDir>/components/$1',
}
```

<br/>

# Jest로 커스텀 Matcher 확장하기(옵셔널)

- `@testing-library/jest-dom` 에는 테스트를 더 쉽게 작성할 수 있도록 `.toBeInTheDocument()` 같은 유틸이 포함되어 있음
- 아래 옵션을 통해서 jest 설정파일에 커스텀 Matcher를 추가할 수 있음

```ts
setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"];
```

그리고나서 jest.setup.ts 파일을 작성함

```ts
import "@testing-library/jest-dom";
```

<br/>

# package.json에 테스트 스크립트 추가

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### 테스트 만들어보기

- 루트 경로에 `__tests__` 라는 폴더를 만들고 진행함
- 아래 예시는 `<Page>` 컴포넌트가 제목을 잘 렌더링 하는지 테스트한다

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  );
}
```

```tsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

describe("Page", () => {
  it("renders a heading", () => {
    render(<Page />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
```

추가 선택사항으로 스냅샷 테스트를 추가해서 컴포넌트의 예기지 않은 변경사항 테스트가 가능함

```tsx
import { render } from "@testing-library/react";
import Page from "../app/page";

it("renders homepage unchanged", () => {
  const { container } = render(<Page />);
  expect(container).toMatchSnapshot();
});
```
