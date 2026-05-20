// scripts/generate-pdf.js
// 손광호 이력서 PDF 생성 스크립트
// Node.js + pdfkit 기반, Noto Sans KR 폰트 사용

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── 색상 팔레트 (홈페이지 기반) ──────────────────────────────────────
const C = {
  sidebarBg:  '#131b2e',
  sidebarFg:  '#e2e8f0',
  muted:      '#94a3b8',
  accent:     '#4edea3',
  primary:    '#124af0',
  bodyText:   '#131b2e',
  bodyMuted:  '#475569',
  cardBg:     '#f8faff',
  tagBg:      '#f1f5f9',
  tagFg:      '#475569',
  white:      '#ffffff',
  divider:    '#e2e8f0',
};

// ─── 폰트 (로컬 npm 패키지 사용) ─────────────────────────────────────
const FONT_DIR = path.join(ROOT, 'node_modules', '@fontsource', 'noto-sans-kr', 'files');
const F = {
  reg:  { name: 'KR-Regular', file: path.join(FONT_DIR, 'noto-sans-kr-korean-400-normal.woff') },
  bold: { name: 'KR-Bold',    file: path.join(FONT_DIR, 'noto-sans-kr-korean-700-normal.woff') },
};

// ─── 레이아웃 상수 ────────────────────────────────────────────────────
const PW = 595.28, PH = 841.89;   // A4
const SW = 178;                    // 사이드바 너비
const MX = SW + 20;                // 본문 시작 X
const MW = PW - MX - 18;          // 본문 너비
const SP = 16;                     // 사이드바 패딩
const HDR = 86;                    // 헤더 높이

// ─── 유틸리티 ─────────────────────────────────────────────────────────
function hex(color) { return color; }  // pdfkit은 hex 문자열을 직접 지원

function drawTag(doc, x, y, text) {
  doc.font(F.reg.name).fontSize(6.5);
  const w = doc.widthOfString(text) + 12;
  doc.rect(x, y, w, 13).fill(C.tagBg);
  doc.fill(C.tagFg).text(text, x + 6, y + 3, { lineBreak: false });
  return w + 4;
}

function drawSideTag(doc, x, y, text) {
  doc.font(F.reg.name).fontSize(7);
  const w = doc.widthOfString(text) + 12;
  doc.rect(x, y, w, 14).fill('#1e293b');
  doc.fill(C.sidebarFg).text(text, x + 6, y + 3.5, { lineBreak: false });
  return w + 5;
}

function sectionHeader(doc, x, y, w, title) {
  doc.font(F.bold.name).fontSize(8).fill(C.primary);
  doc.text(title.toUpperCase(), x, y, { lineBreak: false });
  const tw = doc.widthOfString(title.toUpperCase());
  doc.moveTo(x + tw + 8, y + 5).lineTo(x + w, y + 5)
    .lineWidth(0.6).strokeColor('#124af033').stroke();
  return y + 16;
}

function drawBullet(doc, x, y, text, maxW) {
  // 불릿 원
  doc.circle(x + 3.5, y + 5, 2).fill(C.accent);
  // 텍스트
  doc.font(F.reg.name).fontSize(7.5).fill(C.bodyMuted)
    .text(text, x + 12, y, { width: maxW - 14, lineBreak: true });
  return doc.y + 2;
}

// ─── 메인 생성 함수 ───────────────────────────────────────────────────
async function generatePDF() {
  // 폰트 파일 확인
  if (!fs.existsSync(F.reg.file) || !fs.existsSync(F.bold.file)) {
    throw new Error('폰트 파일을 찾을 수 없습니다. npm install --save-dev @fontsource/noto-sans-kr 실행 필요.');
  }
  console.log('✅ 폰트 확인 완료');

  const doc = new PDFDocument({
    size: [PW, PH],
    margin: 0,
    info: { Title: '손광호 이력서', Author: '손광호', Subject: 'Backend Engineer Resume 2025' },
  });

  // 출력 경로
  const out1 = path.join(ROOT, 'resume.pdf');
  const out2 = path.join(ROOT, 'public', 'resume.pdf');
  if (!fs.existsSync(path.join(ROOT, 'public'))) fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
  const s1 = fs.createWriteStream(out1);
  const s2 = fs.createWriteStream(out2);
  doc.pipe(s1);
  doc.pipe(s2);

  // 폰트 등록
  doc.registerFont(F.reg.name, F.reg.file);
  doc.registerFont(F.bold.name, F.bold.file);

  // ════════════════════════════════════════════
  //  배경
  // ════════════════════════════════════════════
  doc.rect(0, 0, PW, PH).fill(C.white);          // 전체 흰색
  doc.rect(0, 0, SW, PH).fill(C.sidebarBg);      // 사이드바 네이비
  doc.rect(0, 0, PW, HDR).fill(C.sidebarBg);     // 헤더 네이비

  // 헤더 하단 민트 라인
  doc.rect(0, HDR - 2, PW, 2).fill(C.accent + 'aa');

  // ════════════════════════════════════════════
  //  헤더 텍스트
  // ════════════════════════════════════════════
  const HX = MX;

  // 이름
  doc.font(F.bold.name).fontSize(26).fill(C.white).text('손광호', HX, 16, { lineBreak: false });

  // 직함
  doc.font(F.bold.name).fontSize(11).fill(C.accent).text('Backend Engineer', HX, 50, { lineBreak: false });

  // 뱃지
  doc.font(F.reg.name).fontSize(7).fill(C.accent);
  const bBefore = HX + doc.font(F.bold.name).fontSize(11).widthOfString('Backend Engineer') + 14;
  doc.roundedRect(bBefore, 48, 128, 15, 7).fill('#124af033');
  doc.circle(bBefore + 10, 55.5, 2.5).fill(C.accent);
  doc.font(F.reg.name).fontSize(6.5).fill(C.accent)
    .text('2027 하반기 취업 준비 중', bBefore + 17, 51, { lineBreak: false });

  // 연락처 한 줄
  doc.font(F.reg.name).fontSize(7).fill(C.muted)
    .text('rocky0518@daum.net  ·  github.com/ROCKY-040518  ·  대전, 대한민국', HX, 68, { lineBreak: false });

  // ════════════════════════════════════════════
  //  사이드바
  // ════════════════════════════════════════════
  let sy = HDR + 14;

  // ── 프로필 사진 (원형 클리핑) ──
  const ax = SW / 2, ar = 38;
  const profileImg = path.join(ROOT, 'public', 'profile.jpg');
  // 민트 테두리 링
  doc.circle(ax, sy + ar, ar + 3).lineWidth(3).strokeColor(C.accent + '99').stroke();
  // 원형 클리핑 마스크로 사진 삽입 (cover: 비율 유지하며 원형 영역 채우기)
  doc.save();
  doc.circle(ax, sy + ar, ar).clip();
  doc.image(profileImg, ax - ar, sy, { cover: [ar * 2, ar * 2], align: 'center', valign: 'center' });
  doc.restore();
  sy += ar * 2 + 10;

  // 이름 (사이드바)
  doc.font(F.bold.name).fontSize(13).fill(C.white)
    .text('손광호', 0, sy, { width: SW, align: 'center' });
  sy += 16;
  doc.font(F.reg.name).fontSize(8).fill(C.accent)
    .text('Backend Engineer', 0, sy, { width: SW, align: 'center' });
  sy += 12;
  doc.font(F.reg.name).fontSize(6.5).fill(C.muted)
    .text('배재대학교 소프트웨어공학과 4학년', 0, sy, { width: SW, align: 'center' });
  sy += 18;

  function sideLine() {
    doc.moveTo(SP, sy).lineTo(SW - SP, sy).lineWidth(0.4).strokeColor(C.muted + '55').stroke();
    sy += 12;
  }
  sideLine();

  // CONTACT
  doc.font(F.bold.name).fontSize(7).fill(C.accent).text('CONTACT', SP, sy); sy += 12;
  const contacts = [
    '✉  rocky0518@daum.net',
    '⊙  대전, 대한민국',
    '◎  github.com/ROCKY-040518',
    '⊞  linkedin.com/in/rocky0518',
  ];
  contacts.forEach(c => {
    doc.font(F.reg.name).fontSize(7).fill(C.muted).text(c, SP, sy, { width: SW - SP * 2 });
    sy += 12;
  });
  sy += 3; sideLine();

  // EDUCATION
  doc.font(F.bold.name).fontSize(7).fill(C.accent).text('EDUCATION', SP, sy); sy += 12;
  doc.font(F.bold.name).fontSize(9).fill(C.sidebarFg).text('배재대학교', SP, sy, { width: SW - SP * 2 }); sy += 13;
  doc.font(F.reg.name).fontSize(7).fill(C.muted).text('공과대학 소프트웨어공학과', SP, sy, { width: SW - SP * 2 }); sy += 11;
  doc.font(F.reg.name).fontSize(7).fill(C.muted).text('2022.03 — 2026.08 졸업 예정', SP, sy, { width: SW - SP * 2 }); sy += 11;
  doc.rect(SP, sy, 92, 15).fill('#124af033');
  doc.font(F.bold.name).fontSize(7.5).fill(C.accent).text('GPA  3.82 / 4.5', SP + 8, sy + 4, { lineBreak: false });
  sy += 22; sideLine();

  // LANGUAGES
  doc.font(F.bold.name).fontSize(7).fill(C.accent).text('LANGUAGES', SP, sy); sy += 12;
  let tx = SP;
  ['C', 'C#', 'Java', 'Python'].forEach(l => {
    doc.font(F.reg.name).fontSize(7);
    const w = doc.widthOfString(l) + 12;
    if (tx + w > SW - SP) { tx = SP; sy += 17; }
    doc.rect(tx, sy, w, 14).fill('#1e293b');
    doc.fill(C.sidebarFg).text(l, tx + 6, sy + 3.5, { lineBreak: false });
    tx += w + 4;
  });
  sy += 22; sideLine();

  // TOOLS
  doc.font(F.bold.name).fontSize(7).fill(C.accent).text('TOOLS', SP, sy); sy += 12;
  tx = SP;
  ['Visual Studio', 'VS Code', 'Eclipse', 'Copilot', 'Sublime'].forEach(t => {
    doc.font(F.reg.name).fontSize(7);
    const w = doc.widthOfString(t) + 12;
    if (tx + w > SW - SP) { tx = SP; sy += 17; }
    doc.rect(tx, sy, w, 14).fill('#1e293b');
    doc.fill(C.sidebarFg).text(t, tx + 6, sy + 3.5, { lineBreak: false });
    tx += w + 4;
  });
  sy += 22; sideLine();

  // AVAILABLE
  doc.font(F.bold.name).fontSize(7).fill(C.accent).text('AVAILABLE', SP, sy); sy += 12;
  doc.font(F.reg.name).fontSize(8).fill(C.sidebarFg).text('2025년 9월부터 풀타임', SP, sy, { width: SW - SP * 2 });

  // ════════════════════════════════════════════
  //  본문
  // ════════════════════════════════════════════
  let my = HDR + 20;

  // ── PROFILE ──
  my = sectionHeader(doc, MX, my, MW, 'Profile');

  doc.font(F.bold.name).fontSize(11).fill(C.bodyText)
    .text('견고한 백엔드 시스템을 설계합니다.', MX, my, { width: MW });
  my = doc.y + 4;
  doc.font(F.reg.name).fontSize(7.5).fill(C.bodyMuted)
    .text(
      '견문이 점점 넓어지는 개발자 지망생 손광호입니다.\n인공지능과 백엔드 개발에 관심을 가지고 있으며, 다양한 개인/팀 프로젝트를 통해 실전 역량과 협업 경험을 쌓아왔습니다.\n특히 백엔드 구축과 API 연결 및 수정 경험을 통해 백엔드 구조의 이해와 문제 해결력을 키웠습니다.',
      MX, my, { width: MW }
    );
  my = doc.y + 10;

  // 통계 4개 (비활성화 - 정확한 수치 확인 후 재작성 예정)
  // const stats = [['4년','개발 경력'],['12+','프로젝트'],['1회','인턴십'],['1편','공동 논문']];
  // const sw2 = MW / 4;
  // stats.forEach(([val, sub], i) => { ... });
  // my += 40;

  // ── ACTIVITIES (비활성화 - 내용 검토 후 재작성 예정) ──
  // my = sectionHeader(doc, MX, my, MW, 'Activities & Experience');
  // ... 활동 내용은 정확한 정보 확인 후 추가 예정 ...

  // ── PROJECTS ──
  my = sectionHeader(doc, MX, my, MW, 'Featured Projects');

  // 프로젝트 카드: 태그가 본문을 가리지 않도록
  // - 카드 높이를 동적으로 계산 (본문 높이 + 태그 영역 고정)
  const TAG_AREA_H = 22;  // 태그 영역 높이
  const HW = (MW - 10) / 2;

  function projCard(px, pw, accent, title, badge, date, desc, tags) {
    const INNER_PAD = 10;
    const textW = pw - INNER_PAD * 2;

    // 본문 높이를 먼저 측정
    doc.font(F.bold.name).fontSize(9);
    const titleH = doc.heightOfString(title, { width: textW });
    doc.font(F.reg.name).fontSize(7);
    const descH  = doc.heightOfString(desc,  { width: textW });
    // 카드 높이 = 상단패딩(12) + 타이틀 + 뱃지(14) + 날짜(10) + 간격(5) + 본문 + 간격(8) + 태그영역 + 하단패딩(10)
    const CARD_H = 12 + titleH + 14 + 10 + 5 + descH + 8 + TAG_AREA_H + 10;

    doc.rect(px, my, pw, CARD_H).fill(C.cardBg);
    doc.rect(px, my, pw, 4).fill(accent);

    // 제목
    doc.font(F.bold.name).fontSize(9).fill(C.bodyText).text(title, px + INNER_PAD, my + 12, { width: textW });
    const afterTitle = doc.y;

    // 뱃지 (badge = Team PSLW 등)
    if (badge) {
      doc.font(F.bold.name).fontSize(6);
      const bw = doc.widthOfString(badge) + 12;
      doc.rect(px + INNER_PAD, afterTitle + 2, bw, 12).fill(C.accent + '33');
      doc.fill('#005236').text(badge, px + INNER_PAD + 5, afterTitle + 5, { lineBreak: false });
    }

    // 날짜
    doc.font(F.reg.name).fontSize(6.5).fill(C.bodyMuted)
      .text(date, px + INNER_PAD, afterTitle + 18);

    // 본문 설명
    doc.font(F.reg.name).fontSize(7).fill(C.bodyMuted)
      .text(desc, px + INNER_PAD, doc.y + 4, { width: textW });

    // 태그: 본문 바로 아래 8px 간격
    const tgy = doc.y + 8;
    let tgx = px + INNER_PAD;
    tags.forEach(t => { tgx += drawTag(doc, tgx, tgy, t); });

    // 카드 높이 반영 (두 카드는 같은 my를 공유하므로 밖에서 my 갱신)
    return my + CARD_H;
  }

  const newMyAfterProj1 = projCard(
    MX, HW, C.primary,
    '음성파일 요약 API 연동 사이트', 'Team PSLW',
    '2026년 3월 – 현재',
    'AutoGPT API, Gemini API를 사용해 회의 음성 파일을 요약하는 사이트입니다. 다른 고정된 API를 사용하는 것이 아닌, 사용자가 각자 소유한 API 키를 직접 사용할 수 있는 유연한 설계 방식을 적용해 개발하고 있습니다.',
    ['AutoGPT API', 'Gemini API', 'Audio Summary', 'API Integration']
  );

  const newMyAfterProj2 = projCard(
    MX + HW + 10, HW, C.accent,
    '욕설 필터링 AI 프로젝트', 'Team PSLW',
    '2025년 3월 – 2025년 12월',
    '텍스트 내의 욕설을 자동으로 감지하고 차단하는 AI 모델을 연구·개발하고, 해당 AI 솔루션이 실제로 적용된 웹 테스트 사이트를 구축했습니다. 머신러닝/AI를 적용해 성공적으로 완료한 첫 협업 프로젝트입니다.',
    ['AI', 'NLP', '욕설 필터링', 'Model Development', 'Test Bed Site']
  );

  my = Math.max(newMyAfterProj1, newMyAfterProj2) + 10;

  // ── 풋터 ──
  doc.rect(0, PH - 24, PW, 24).fill(C.sidebarBg);
  doc.rect(0, PH - 24, PW, 2).fill(C.accent + '88');
  doc.font(F.reg.name).fontSize(7).fill(C.muted)
    .text('손광호  ·  Backend Engineer  ·  rocky0518@daum.net  ·  github.com/ROCKY-040518',
      0, PH - 14, { width: PW, align: 'center' });

  // ════════════════════════════════════════════
  doc.end();
  await Promise.all([s1, s2].map(s => new Promise((res, rej) => { s.on('finish', res); s.on('error', rej); })));

  const kb = (fs.statSync(out1).size / 1024).toFixed(0);
  console.log(`\n✅ PDF 생성 완료! (${kb} KB)`);
  console.log(`   📄 ${out1}`);
  console.log(`   📄 ${out2}`);
}

generatePDF().catch(err => {
  console.error('❌ PDF 생성 실패:', err.message);
  process.exit(1);
});
