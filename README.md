# career-portfolio-web

Notion을 CMS로 쓰는 개인 포트폴리오 사이트입니다. 이력·프로젝트·기술 스택은 Notion DB에서 관리하고, 사이트는 `Public` 체크가 켜진 행만 읽어 렌더링합니다.

- 사이트: https://career-portfolio-web-one.vercel.app/
- A4 이력서(인쇄용): `/print`

## 왜 만들었나

이력과 프로젝트 기록이 Obsidian 마크다운과 정적 프로필 사이트로 나뉘어 있어서, 내용을 고칠 때마다 두 곳을 손봐야 했습니다. 인프런 강의 수강 자료(Next.js 스타터킷)에서 힌트를 얻어, Notion을 단일 원본으로 두고 사이트는 읽기만 하는 구조로 바꿨습니다.

## 구조

```
Notion (원본, 비공개 워크스페이스)
  └─ DB 5개: Orgs · Projects · Achievements · Skills · Profile
        │  Public = true 인 행만 쿼리 (서버에서 필터)
        ▼
Next.js 15 (App Router, Server Components)
  ├─ /            단일 페이지: hero · skills · changelog · pinned · side · contact
  ├─ /print       A4 이력서 (noindex)
  └─ /api/revalidate   POST + Bearer 시크릿 → 캐시 즉시 갱신
        ▼
Vercel (ISR 1시간 + 온디맨드 갱신)
```

- 데이터 조회: `src/lib/notion/queries.ts` (`unstable_cache`, 태그 `portfolio`)
- Notion 속성 → 도메인 타입: `src/lib/notion/mappers.ts`
- 본문 파싱: `src/lib/notion/markdown.ts` (STAR 블록, 수강 이력)
- 스키마 상세: [`docs/notion-schema.md`](docs/notion-schema.md)

### 설계 포인트

- **공개 제어는 서버에서**: `Public` 필터를 쿼리 단계에서 강제합니다. 비공개 행은 서버가 아예 읽지 않습니다.
- **비공개 메모 차단**: 프로젝트 본문에서 `## S —`, `## T —`, `## A —`, `## R —` 형식의 제목만 STAR로 읽습니다. 그 외 제목(예: `## 상세 (비공개 메모)`) 아래 내용은 사이트에 나오지 않습니다.
- **XSS 방어**: 본문은 평문으로 변환해 React 기본 이스케이프에 맡깁니다. `dangerouslySetInnerHTML`을 쓰지 않습니다.
- **토큰은 서버 전용**: `NOTION_TOKEN` 등은 `NEXT_PUBLIC_` 접두사 없이 서버에서만 읽고, `src/lib/env.ts`에서 Zod로 검증합니다.
- **갱신 API 보호**: `/api/revalidate`는 `Authorization: Bearer` 시크릿을 `timingSafeEqual`로 비교하고, 실패하면 401을 반환합니다.
- **회사 업무와 개인 프로젝트 분리**: `Kind`(work/side) 속성으로 구분합니다. side 프로젝트는 별도 섹션에 나오고, 회사 변경 이력에는 섞이지 않습니다.

## 기술 스택

Next.js 15 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Notion API (`@notionhq/client`) · Zod · pnpm · Vercel

## 실행

필요한 것: Node.js, pnpm, Notion Internal Integration 토큰, 위 스키마대로 만든 Notion DB 5개.

```bash
pnpm install
cp .env.example .env.local   # 값을 채운다 (아래 표 참고)
pnpm dev                     # http://localhost:3000
```

개발 서버에서는 캐시를 쓰지 않아, Notion에서 고친 내용이 새로고침하면 바로 보입니다.

### 환경변수

| 이름                                                                                                                 | 설명                                                                             |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `NOTION_TOKEN`                                                                                                       | Notion Internal Integration 토큰. 부모 페이지에 연결을 추가해야 읽을 수 있습니다 |
| `NOTION_ORGS_DS_ID` `NOTION_PROJECTS_DS_ID` `NOTION_ACHIEVEMENTS_DS_ID` `NOTION_SKILLS_DS_ID` `NOTION_PROFILE_DS_ID` | 각 DB의 data source ID                                                           |
| `REVALIDATE_SECRET`                                                                                                  | 갱신 API용 시크릿 (16자 이상 무작위 값)                                          |
| `APP_URL`                                                                                                            | 사이트 주소 (OG 메타용, 선택, 서버 전용)                                         |

`.env.local`은 커밋하지 않습니다 (`.gitignore`에 포함).

### 스크립트

```bash
pnpm check-all   # 타입 검사 + ESLint + Prettier
pnpm build       # 프로덕션 빌드
```

## 배포와 갱신

Vercel에 연결하고 위 환경변수를 등록하면 배포됩니다. 환경변수를 바꾸면 새 배포부터 적용됩니다.

- 기본: 1시간마다 ISR로 갱신
- 즉시 반영:

```bash
curl -X POST https://<도메인>/api/revalidate -H "Authorization: Bearer $REVALIDATE_SECRET"
```

성공하면 `{"ok":true,...}`, 시크릿이 틀리면 401을 반환합니다. 명령은 한 줄로 실행하세요. 줄바꿈용 `\` 뒤에 공백이 있으면 URL이 깨집니다.

## 디렉터리

```
src/
├─ app/                 page.tsx · print/ · api/revalidate/
├─ components/
│  ├─ layout/           헤더 · 섹션 내비게이션(scroll spy)
│  ├─ sections/         hero · skills · changelog · pinned · side · contact
│  └─ print/            A4 이력서
├─ lib/
│  ├─ notion/           client · queries · mappers · markdown · props
│  ├─ career-format.ts  기간·경력 계산 (순수 함수)
│  └─ env.ts            환경변수 검증 (Zod)
└─ styles/              career.css · print.css
```

## 출처

- 프로젝트 골격은 인프런 강의 수강 자료의 Next.js 스타터킷에서 출발했습니다.
- 폰트는 [Pretendard](https://github.com/orioncactus/pretendard)(SIL OFL 1.1)를 self-host합니다.
