# Portfolio Template — The Architectural Compiler

컴퓨터공학 졸업생을 위한 고퀄리티 포트폴리오 웹사이트 템플릿입니다.  
순수 **HTML / CSS / JS** 만 사용 — 빌드 도구 없이 GitHub Pages로 바로 배포됩니다.

---

## 파일 구조

```
portfolio-template/
├── index.html              ← 메인 페이지 (모든 섹션)
├── css/
│   └── style.css           ← 전체 스타일 (테마 변수 포함)
├── js/
│   └── main.js             ← 타이핑 효과, 스크롤 애니메이션 등
├── assets/
│   └── images/
│       └── profile.jpg     ← 본인 사진으로 교체
└── README.md
```

---

## GitHub Pages 배포 방법

1. GitHub에서 새 저장소 생성 (예: `my-portfolio`)
2. 이 폴더 전체를 `main` 브랜치에 push
3. 저장소 **Settings → Pages → Branch: main → Save**
4. 잠시 후 `https://[username].github.io/[repo-name]` 에서 확인

> `index.html` 이 루트에 있으므로 GitHub Pages가 자동으로 인식합니다.

---

## 커스터마이징 가이드

`index.html` 과 `css/style.css` 에서 `✏️ EDIT` 주석이 달린 곳만 수정하면 됩니다.

### 1. 기본 정보 (index.html)

| 위치 | 수정 내용 |
|---|---|
| `<title>` | 페이지 탭 제목 |
| `.nav-logo` | 이니셜 또는 짧은 이름 |
| `.hero-eyebrow` | 전공·졸업 연도 |
| `.hero-name` | 본인 이름 |
| `.hero-desc` | 한두 줄 자기소개 |
| `about-desc` 단락들 | 상세 자기소개 |
| `about-stats` | 숫자 통계 (코딩 연수, 프로젝트 수 등) |

### 2. 타이핑 텍스트 (js/main.js)

```js
// main.js 상단의 roles 배열 수정
const roles = [
  'Full-Stack Developer',
  'Backend Engineer',
  // ← 원하는 직함 추가
];
```

### 3. 색상 & 테마 (css/style.css)

`style.css` 최상단 `:root { }` 블록에서 CSS 변수 한 줄만 바꾸면 전체 색상이 변경됩니다.

```css
/* 예시: 메인 포인트 컬러를 보라색으로 변경 */
--primary:           #7c3aed;
--primary-container: #2e1065;
```

주요 변수:

| 변수 | 역할 |
|---|---|
| `--primary` | 메인 브랜드 색 (링크, 버튼, 강조) |
| `--primary-container` | 그라디언트 시작 색 |
| `--tertiary` | 보조 액센트 (Available 뱃지, 칩 점) |
| `--on-surface` | 메인 텍스트 색 |
| `--surface` | 페이지 기본 배경 |

### 4. 프로젝트 카드 추가

`index.html`의 `projects-grid` 안에 아래 블록을 복사·붙여넣기합니다:

```html
<article class="project-card reveal">
  <div class="project-meta">
    <span class="label-sm project-year">2024</span>
    <div class="project-links">
      <a href="GitHub URL" class="icon-link" aria-label="GitHub">
        <!-- GitHub SVG 아이콘 (기존 카드에서 복사) -->
      </a>
    </div>
  </div>
  <h3 class="title-lg project-title">프로젝트 이름</h3>
  <p class="body-md project-desc">프로젝트 설명</p>
  <div class="chips-group">
    <span class="chip">React</span>
    <span class="chip">Node.js</span>
  </div>
</article>
```

### 5. 경력 / 학력 타임라인 추가

```html
<article class="timeline-item reveal">
  <span class="timeline-anchor" aria-hidden="true">24</span>  <!-- 연도 두 자리 -->
  <div class="timeline-body">
    <div class="timeline-header">
      <div>
        <h3 class="title-lg timeline-role">직책 이름</h3>
        <span class="timeline-company label-md">회사/학교 이름</span>
      </div>
      <span class="label-sm timeline-period">Mar 2024 — Aug 2024</span>
    </div>
    <ul class="timeline-points body-md">
      <li>주요 성과 1</li>
      <li>주요 성과 2</li>
    </ul>
    <div class="chips-group">
      <span class="chip">사용 기술</span>
    </div>
  </div>
</article>
```

### 6. 프로필 사진

`assets/images/profile.jpg` 파일을 본인 사진으로 교체합니다.  
권장 비율: **4:5** (세로형), 최소 800×1000px.

### 7. 연락처 (index.html)

```html
<!-- ✏️ EDIT: 이메일, GitHub, LinkedIn URL 변경 -->
<a href="mailto:your@email.com" ...>your@email.com</a>
<a href="https://github.com/yourusername" ...>github.com/yourusername</a>
<a href="https://linkedin.com/in/yourusername" ...>linkedin.com/in/yourusername</a>
```

### 8. 이메일 폼 실제 전송 연동 (선택)

기본 폼은 정적 피드백만 보여줍니다. 실제 이메일 전송이 필요하면 `main.js` 내 Formspree 주석을 해제합니다:

1. [formspree.io](https://formspree.io) 에서 무료 계정 생성 → 폼 생성 → ID 복사
2. `main.js`에서 `YOUR_FORM_ID` 를 복사한 ID로 교체
3. 주석(`/* */`) 제거

---

## 디자인 시스템 요약

- **헤드라인 폰트**: Manrope (Bold/ExtraBold/Black)
- **본문 폰트**: Inter (Regular/Medium/SemiBold)
- **라인 금지 원칙**: `<hr>` 또는 1px border 사용 금지 — 배경색 변화로 구분
- **칩 상태 점**: `--tertiary-fixed-dim` (#4edea3) 녹색 점으로 "Active" 신호
- **타임라인**: 연도 watermark 를 배경 요소로 사용 (Spatial Anchor 기법)
- **반응형**: 모바일/태블릿/데스크탑 CSS Grid + media query

---

## 라이선스

MIT — 자유롭게 사용, 수정, 배포 가능합니다.
