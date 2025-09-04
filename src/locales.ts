import {i18n} from "@lingui/core";
import {t} from "@lingui/macro";

export type SupportedLocales = "en" | "de" | "fr" | "it" | "nl" | "pt" | "es" | "zh-cn" | "pt-br" | "vi" |"zh-hk";

export const availableLocales = ["en", "de", "fr", "it", "nl", "pt", "es", "zh-cn", "zh-hk", "pt-br", "vi",];

export const localeToFlagEmojiMap: Record<SupportedLocales, string> = {
    en: '🇬🇧',
    de: '🇩🇪',
    fr: '🇫🇷',
    it: '🇮🇹',
    nl: '🇳🇱',
    pt: '🇵🇹',
    es: '🇪🇸',
    "zh-cn": '🇨🇳',
    "zh-hk": '🇭🇰',
    "pt-br": '🇧🇷',
    vi: '🇻🇳',
};

export const getLocaleName = (locale: SupportedLocales) => {
    if (locale === "en") return t`English`;
    if (locale === "de") return t`German`;
    if (locale === "fr") return t`French`;
    if (locale === "it") return t`Italian`;
    if (locale === "nl") return t`Dutch`;
    if (locale === "pt") return t`Portuguese`;
    if (locale === "es") return t`Spanish`;
    if (locale === "zh-cn") return t`Chinese`;
    if (locale === "zh-hk") return t`Cantonese`;
    if (locale === "pt-br") return t`Portuguese (Brazil)`;
    if (locale === "vi") return t`Vietnamese`;
    return locale;
}

export const getClientLocale = () => {
    if (typeof window !== "undefined") {
        const storedLocale = document
            .cookie
            .split(";")
            .find((c) => c.includes("locale="))
            ?.split("=")[1];

        if (storedLocale) {
            return getSupportedLocale(storedLocale);
        }

        return getSupportedLocale(window.navigator.language);
    }

    return "en";
};

export async function dynamicActivateLocale(locale: string) {
    locale = availableLocales.includes(locale) ? locale : "en";
    const module = (await import(`./locales/${locale}.po`));
    i18n.load(locale, module.messages);
    i18n.activate(locale);
}

export const getSupportedLocale = (userLocale: string) => {
    const normalizedLocale = userLocale.toLowerCase();

    if (availableLocales.includes(normalizedLocale)) {
        return normalizedLocale;
    }

    const mainLanguage = normalizedLocale.split('-')[0];
    const mainLocale = availableLocales.find(locale => locale.startsWith(mainLanguage));
    if (mainLocale) {
        return mainLocale;
    }

    return "en";
};
