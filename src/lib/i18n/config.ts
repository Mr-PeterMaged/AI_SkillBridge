export const SUPPORTED_LOCALES = ["en", "ar"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const LOCALE_DIRECTION: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export function isSupportedLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function textDirection(locale: Locale) {
  return LOCALE_DIRECTION[locale];
}

export const POSITIONING_COPY = {
  en: "SkillBridge AI does not just tell students what skills are missing. It tells them what to learn, what to build, and how to prove they are ready.",
  ar: "SkillBridge AI لا يخبر الطالب فقط بالمهارات الناقصة؛ بل يحدد له ماذا يتعلم، ماذا يبني، وكيف يثبت أنه جاهز.",
} satisfies Record<Locale, string>;
