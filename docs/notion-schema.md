# Notion CMS 스키마

Notion 개인 워크스페이스 "Career" → 페이지 "Career Portfolio" 아래 5개 DB. `Public` 체크박스가 켜진 행만 사이트에 노출된다 (쿼리 단계에서 강제, `src/lib/notion/queries.ts`).

| DB           | 환경변수                  | 주요 속성                                                                            |
| ------------ | ------------------------- | ------------------------------------------------------------------------------------ |
| Profile      | NOTION_PROFILE_DS_ID      | Name, RoleFrom, RoleTo, Email, SiteUrl, CareerStart, CurrentStart                    |
| Orgs         | NOTION_ORGS_DS_ID         | Name, Ver, Role, Start, End, Ongoing, LogTitle, Summary                              |
| Projects     | NOTION_PROJECTS_DS_ID     | Name, Ver, Slug, Period, Status, Size, Stack, Summary, CardDesc, Note, Pinned, Order |
| Achievements | NOTION_ACHIEVEMENTS_DS_ID | Name, Metric, Value, Unit, Featured                                                  |
| Skills       | NOTION_SKILLS_DS_ID       | Name, Category, Level, Status, Note, Order                                           |

- 변경 이력 = Orgs(major) + `Ver`가 있는 Projects (Size large=minor / small=patch). `Ver`는 숫자로 파싱해 정렬한다.
- 핀 카드 = `Pinned`인 Projects, 본문의 `## S/T/A/R — …` H2 블록이 STAR 패널이 된다.
- `Kind`(work/side): 빈 값은 work. side는 회사 업무 외 프로젝트로, 변경 이력(`Ver`)에서 제외되고 `Pinned`인 행이 "side" 섹션 카드가 된다. `Origin`은 카드에 한 줄로 노출되는 시작 계기.
- Skills 본문의 "라벨 URL" 줄은 수료증 링크가 된다.
- 갱신: 기본 1시간 ISR, 즉시 반영은 `POST /api/revalidate` (`Authorization: Bearer $REVALIDATE_SECRET`).

## 연결 방법

1. https://www.notion.so/profile/integrations 에서 Internal Integration 생성 (읽기 권한만).
2. "Career Portfolio" 페이지 → ⋯ → 연결 → 해당 Integration 추가.
3. `.env.local`에 `NOTION_TOKEN` 등 설정 (`.env.example` 참고). 토큰은 서버 전용이며 커밋 금지.
