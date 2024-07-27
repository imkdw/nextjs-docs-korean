# 시스템 요구사항

- Node.js 18.17 또는 그 이상의 버전
- macOS, Window / WSL, Linux를 지원함

<br/>

# 자동 설치

- Next.js를 시작할때 `create-next-app`을 활용하는것을 추천함
- 모든것을 자동으로 설치해줌

```bash
npx create-next-app@latest
```

위 커맨드를 입력하면 아래와 같은 프롬프트가 나옴

```bash
# 프로젝트 이름
What is your project named? my-app

# 타입스크립트 사용여부
Would you like to use TypeScript? No / Yes

# ESLint 사용여부
Would you like to use ESLint? No / Yes

# Tailwind CSS 사용여부
Would you like to use Tailwind CSS? No / Yes

# src/ 디렉토리 사용여부, 체크시 src/app 경로로 폴더 생성됨
Would you like to use `src/` directory? No / Yes

# 앱 라우터 사용여부, no 선택시 pages router 사용
Would you like to use App Router? (recommended) No / Yes

# import 별칭 사용여부 및 사용방법 설정
Would you like to customize the default import alias (@/*)? No / Yes
What import alias would you like configured? @/*
```

프롬프트 답변 후에는 폴더구조가 생성되며 필요한 패키지들이 설치됨

<br/>

# 수동설치

수동으로 새로운 Next.js을 만든느 경우 필요한 패키지를 따로 설치해줌

```bash
npm install next@latest react@latest react-dom@latest
```

이후에 package.json에서 scripts 부분에 아래처럼 설정함

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

위 스크립트는 어플리케이션을 개발할때 여러 단계를 나타내줌

- `dev`: 개발 모드에서 실행
- `build` : 프로젝트 빌드
- `start` : 빌드된 결과물을 프로덕션 환경으로 실행
- `lint` : 기존에 설정된 ESLint 설정을 통한 린트 진행

<br/>

# 폴더 생성

- Next.js는 파일 시스템 기반 라우팅을 사용함
- 파일/폴더 구조를 어떻게 설정하는지에 따라 라우터가 결정됨

### App 폴더

- 새로운 어플리케이션에서는 App Router를 사용하는것을 권장함
- 리액트의 최신 기능들을 사용할 수 있음
- Pages Router에 대한 피드백을 통해 진화시킨 버전임
- app/ 폴더 하위에 `layout.tsx`, `page.tsx`를 만들면 localhost:3000 접근시 해당 페이지를 응답받음

![alt](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Fapp-getting-started.png&w=1920&q=75)

### 최상위 레이아웃

- `app/layout.tsx`에는 `<html>`태그와 `<body>`태그가 필수로 들어가야함

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 페이지

- 추가로 콘텐츠를 넣고싶은 경우, `app/page.tsx`를 생성함

```tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
```
