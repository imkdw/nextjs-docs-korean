# 마크다운 및 MDX

### 마크다운

- 텍스트 서식을 지정하는 데 사용되는 경량화된 마크업 언어임
- 일반 텍스트 구문을 사용해서 작성하고 구조적으로 유효한 HTML로 변환도 가능함
- 보통 웹사이트 및 블로그를 작성하는데 많이 사용함

```
I **love** using [Next.js](https://nextjs.org/)
```

위 결과는 아래 처럼 HTML로 변환됨

```html
<p>I <strong>love</strong> using <a href="https://nextjs.org/">Next.js</a></p>
```

<br/>

### MDX

- 마크다운의 슈퍼셋으로 마크다운 파일에 JSX를 직접 작성이 가능함
- 동적인 상호작용을 추가하고 콘텐츠 내부에 React 컴포넌트 추가가 가능한 방법임
- Next.js는 앱 내부의 로컬 MDX 콘텐츠와 서버에서 동적으로 가져온 원격 MDX 파일을 모두 지원함
- Next.js 플러그인 서버 컴포넌트에서 사용을 지원하는것을 포함한 마크다운 및 React 컴포넌트를 HTML로 변환하는 작업을 처리함
- 위 작업은 App 라우터의 기본값임

<br/>

# `@next/mdx`

- 마크다운과 MDX를 처리할 수 있는 Next.js 앱을 구성하는데 사용됨
- 로컬 파일에서 데이터를 가져오기 때문에 `/pages` 또는 `/app` 폴더 내부에서 `.mdx` 확장자를 가진 페이지를 만들 수 있음

<br/>

# 실습해보기

먼저 mdx를 렌더링 하기위한 패키지를 설치해줌

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

`mdx-components.tsx` 파일을 루트 경로에 만들어줌

App 라우터 기준에서 위 파일이 없다면 MDX 사용이 불가능함

```tsx
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
```

`next.config.mjs`에서 MDX 설정을 추가함

```mjs
const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

module.exports = withMDX(nextConfig);
```

그리고나서 app 폴더 내부에 mdx 페이지를 생성함

```
  your-project
  ├── app
  │   └── my-mdx-page
  │       └── page.mdx
  └── package.json
```

이제 MDX 페이지 내부에서 직접 마크다운을 정의하고 React 컴포넌트 사용이 가능함

```tsx
import { MyComponent } from 'my-components'

# Welcome to my MDX page!

This is some **bold** and _italics_ text.

This is a list in markdown:

- One
- Two
- Three

Checkout my React component:

<MyComponent />
```

<br/>

# 원격 MDX

- 마크다운이나 MDX 파일이 외부에 있는 경우 서버에서 동적으로 로딩이 가능함
- 이 기능은 별도의 로컬 폴더, CMS, DB, 스토리지 등 에 저장되어있을때 유용함
- 이런 용도로 많이 사용되는 패키지는 `next-mdx-remote` 임
- 주의할점은 MDX는 JS로 컴파일되어 서버에서 실행됨. 신뢰가능한 경로에서만 MDX 콘텐츠를 가져와야하며, 그렇지 않은 경우는 원격 코드 실행(RCE) 취약점이 발생할수도 있음

```tsx
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function RemoteMdxPage() {
  // MDX 파일을 외부에서 가져옴
  const res = await fetch("https://...");
  const markdown = await res.text();
  return <MDXRemote source={markdown} />;
}
```

<br/>

# 레이아웃

- MDX 페이지에서 레이아웃을 공유하려면 App 라우터에 내장된 레이아웃 기능을 쓰면됨

```tsx
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ color: "blue" }}>{children}</div>;
}
```

<br/>

# Remark 및 Retype 플러그인

- MDX 콘텐츠를 변환하기 위해서는 `remark` 및 `rehype` 플러그인 사용이 가능함
- 예를 들어서 Github의 마크다운을 지원하기 위해서 `remark-gfm`을 사용할 수 있음
- remark, rehype 생태게는 ESM 전용임, 구성파일로 `next.config.mjs`를 써야함

```mjs
import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
```

<br/>

# Frontmatter

- 페이지에 대한 데이터를 저장하는데 사용할 수 있는 YAML이랑 비슷한 key/value의 데이터임
- `@next/mdx` 는 기본적으로 frontmatter를 지원하지 않지만 MDX 콘텐츠에 frontmatter를 추가하는 해결방법이 있음
  - remark-frontmatter
  - remark-mdx-frontmatter
  - gray-matter.

`@next/mdx`를 사용하면 .mdx 파일에서 메타데이터를 반환할 수 있음

```tsx
export const metadata = {
  author: 'John Doe',
}

# My MDX page
```

<br/>

# 커스텀 엘리먼트

- 마크다운을 사용할 때 좋은점중 하나는 기본 HTML 요소에 매핑되어 빠르고 직관적으로 작성이 가능함

```
This is a list in markdown:

- One
- Two
- Three
```

이걸 HTML로 변환하면 이렇게 나옴

```html
<p>This is a list in markdown:</p>

<ul>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>
```

웹이나 앱에서 스타일에 대한 커스텀이 필요하다면 짧은 코드를 추가로 작성해서 가능함

```tsx
import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

// MDX 파일을 사용할때 리액트 컴포넌트, 인라인 스타일, 다른 컴포넌트에서 제공하는 스타일 등 을 사용이 가능함
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
    img: (props) => <Image sizes="100vw" style={{ width: "100%", height: "auto" }} {...(props as ImageProps)} />,
    ...components,
  };
}
```

<br/>

# 어떻게 마크다운이 HTML로 변환되는 걸까

- 기본적으로 리액트는 마크다운을 이해하지 못함
- 마크다운은 먼저 HTML로 변환이 필요함
- 해당 작업은 `remark`랑 `retype`을 이용해서 가능함
- `remark`는 마크다운을 위한 생태계로 `rehype`도 동일하지만 이건 HTML을 위한것임

```ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

main();

async function main() {
  const file = await unified()
    .use(remarkParse) // 문자열을 마크다운 AST로 변환
    .use(remarkRehype) // 마크다운 AST를 HTML AST로 변환
    .use(rehypeSanitize) // HTML 내용을 안전하게 만듬
    .use(rehypeStringify) // HTML AST를 문자열로 변환함
    .process("Hello, Next.js!"); // 문자열을 처리함

  console.log(String(file)); // <p>Hello, Next.js!</p>
}
```

위 플러그인에는 하이라이팅, 링크, 헤더 등이 포함되어 있음

`@next/mdx`를 사용하는 경우는 자동으로 처리가 되므로 굳이 위 방법을 사용할 필요는 없음

<br/>

# 러스트 기반의 MDX 컴파일러 사용하기(실험적인 기능)

- Next.js는 러스트로 만들어진 새로운 MDX 컴파일러를 지원함
- 아직 실험중이라서 프로덕션용에는 사용하지 않는것을 권장함

```mjs
module.exports = withMDX({
  experimental: {
    mdxRs: true,
  },
});
```
