import { profile } from "./data/profile";

type HeroField = Exclude<keyof typeof profile, "links">;

const heroLinkText = {
  email: "강의 문의하기",
  career: "상세 이력 보기"
} as const;

const heroLinkLabels = {
  email: "lifeprof@naver.com으로 이메일 보내기",
  career: "상세 이력 섹션으로 이동"
} as const;

export function renderHero(): void {
  const fields = document.querySelectorAll<HTMLElement>("[data-hero-field]");

  fields.forEach((field) => {
    const key = field.dataset.heroField as HeroField | undefined;

    if (key && key in profile) {
      field.textContent = profile[key];
    }
  });

  Object.entries(profile.links).forEach(([key, href]) => {
    const linkKey = key as keyof typeof profile.links;
    const link = document.querySelector<HTMLAnchorElement>(`[data-hero-link="${linkKey}"]`);

    if (!link) {
      return;
    }

    link.href = href;
    link.textContent = heroLinkText[linkKey];
    link.setAttribute("aria-label", heroLinkLabels[linkKey]);
  });
}
