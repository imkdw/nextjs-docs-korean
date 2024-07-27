# Loading.ts

- React Suspense를 통해서 의미있는 로딩 UI를 만들 수 있다
- 네트워크 등을 통한 콘텐츠 로딩시 서버에서 즉시 로드된 데이터를 보여줄 수 있다
- 렌더링이 완료되면 새로운 콘텐츠가 자동으로 변경된다

![](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Floading-ui.png&w=1920&q=75)

<br/>

# 즉각 로딩 상태 - Instant Loading States

- 탐색 즉시 나타나는 Fallback UI 이다.
- 예시로는 스켈레톤, 스피너 등 로딩중이라는걸 보여줄 수 있다
- 이는 앱이 로딩 또는 응답중이라는 더 나은 UX 제공이 가능하다
- 폴더 내부에 loading.ts 파일을 추가해서 로딩 상태를 만들 수 있다

![](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Floading-special-file.png&w=1920&q=75)

```tsx
export default function Loading() {
  // UI 내부에 스켙레톤 등 로딩 UI를 만들 수 있다
  return <LoadingSkeleton />;
}
```

- 같은 폴더에 있다면 `layout`에서 중첩된다
- 자동으로 `page`를 감싸게 되며 `Suspense` 바운더리 내부에 `children props`를 통해서 감쌀수도 있다

![](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Floading-overview.png&w=1920&q=75)

<br/>

# Suspense로 스트리밍 하기

- loading.ts뿐만 아니라 직접 Suspense 바운더리를 구성할 수 있다.
- App Router는 Node.js와 Edge 런타임에 대해서 스트리밍을 지원한다.

### 스트리밍이 뭘까

- React와 Next.js에서 스트리밍이 어떻게 동작하는지 배울려면 SSR과 SSR의 한계점에 대해서 이해해야한다.
- SSR 환경에서 유저에게 페이지가 보여지기까지 아래 과정이 필요하다
  1. 먼저 해당 페이지의 모든 데이터를 서버에서 가져온다
  2. 서버는 해당 페이지에 대한 HTML 파일을 렌더링한다
  3. HTML, CSS, JS 등 페이지에 필요한 파일을 클라이언트한테 보낸다
  4. 생성된 HTML과 CSS를 통해서 껍데기 인터페이스를 보여준다
  5. 마지막으로 리액트는 `hydration` 과정을 통해 대화형으로 만든다

![](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Fserver-rendering-without-streaming-chart.png&w=1920&q=75)

- 위 과정은 모두 순차적이고 블로킹이 발생
- 서버는 모든 데이터 로딩이 완료됬을떄 HTML을 한번 렌더링함
- 리액트는 페이지의 모든 코드가 다운로드된 후에만 UI에 인터렉션을 추가할 수 있음
- 먼저 non-interactive한 페이지를 보여주고나서 hydration 과정을 거침으로써 페이지를 빠르게 보여줄 수 있고 UX가 향상된다

![](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Fserver-rendering-without-streaming.png&w=1920&q=75)

- 위 과정은 서버에서 모든 데이터를 가져오는 작업이 끝나야 유저에게 페이지가 보여지게됨

- 스트리밍을 사용하면 HTML을 더 작은 단위로 분할해서 서버에서 클라이언트로 점진적으로 전송이 가능함

- 즉 UI를 렌더링하기 전에 모든 데이터가 로드될때까지 기다리지 않고 페이지의 일부를 떠 빨리 표현할 수 있음

![](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Fserver-rendering-with-streaming.png&w=1920&q=75)

- 리액트는 각 요소를 청크로 간주할 수 있기 때문에 스트링이 가능함
- 우선순위가 높거나 네트워크 등 데이터로딩에 의존하지 않는 요소를 먼저 보낼수 있음
- 우선순위가 낮은 요소(리뷰, 연관제품 등)는 데이터를 가져온 후 동일한 서버요청으로 보낼 수 있음

![](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Fserver-rendering-with-streaming-chart.png&w=1920&q=75)

- 스트리밍은 TTFB(Time To First Byte)와 FCP(First Contentful Paint)를 줄일 수 있음
- 오래 걸리는 데이터 요청이 렌더링을 블로킹하는것을 방지할때 유용함
- 또한 느린 디바이스에서 TTI(Time To Interactive)를 개선할떄 도움이됨

#### 예시

- `Suspense`는 동기 액션(데이터 로딩 등)을 감싸서 fallback ui(스켈레톤, 스피너 등)을 보여줄 수 있음
- 로딩이 끝나면 실제 컴포넌트와 스왑하는 방식으로 작동함

```tsx
import { Suspense } from "react";
import { PostFeed, Weather } from "./Components";

export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  );
}
```

- `Suspense`를 사용하면 아래와 같은 장점이 있음

  1. 스트리밍 서버 렌더링 : 서버에서 클라이언트로 HTML을 점진적으로 렌더링
  2. 선택적 hydration : 유저의 상호작용을 기반으로 먼저 interactive가 필요한 요소의 우선순위를 지정할 수 있음

<br/>

# SEO - Search Engine Optimize

- 클라이언트에 UI를 스트리밍하기 이전에 메타데이터 생성 내부의 데이터 로딩이 완료될떄까지 기다림
- 이를 통해서 처음 스트리밍 응답값에 `<head>`태그가 포함되게된다
- 스트리밍은 서버에서 렌더링되므로 SEO에 영향을 주지 않음

<br/>

# 상태코드

- 스트리밍이 시작되면 응답헤더에 이미 `HTTP 200`코드가 반환됨
- 그러므로 상태코드를 나중에 변경이 불가능함
- 서버는 스트리밍된 콘텐츠 내에서도 클라이언트에 에러나 이슈 전달이 가능함
  - 예를 들면 `redirect`, `notFound`를 사용할때 가능함
