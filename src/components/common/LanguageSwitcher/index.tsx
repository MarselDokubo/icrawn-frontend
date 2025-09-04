import {Select} from "@mantine/core";
import {dynamicActivateLocale, getClientLocale, SupportedLocales} from "../../../locales.ts";
 
import {IconWorld} from "@tabler/icons-react";
import {useLingui} from "@lingui/react";

export const LanguageSwitcher = () => {
    useLingui();

    // Ideally these would be in the locales.ts file, but when they're there they don't translate
    const getLocaleName = (locale: SupportedLocales): string => {
        switch (locale) {
            case "de":
                return `German`;
            case "en":
                return `English`;
            case "es":
                return `Spanish`;
            case "fr":
                return `French`;
            case "it":
                return `Italian`;
            case "nl":
                return `Dutch`;
            case "pt":
                return `Portuguese`;
            case "pt-br":
                return `Brazilian Portuguese`;
            case "zh-cn":
                return `Chinese (Simplified)`;
            case "zh-hk":
                return `Chinese (Traditional)`;
            case "vi":
                return `Vietnamese`;
        }
    };

    return (
        <>
            <Select
                leftSection={<IconWorld size={15} color={'#ccc'}/>}
                width={180}
                size={'xs'}
                required
                data={[
                    "en", "de", "fr", "it", "nl", "pt", "es", "zh-cn", "zh-hk", "pt-br", "vi"
                ].map(locale => ({
                    value: locale,
                    label: getLocaleName(locale as SupportedLocales),
                }))}
                defaultValue={getClientLocale()}
                placeholder={`English`}
                onChange={(value) =>
                    dynamicActivateLocale(value as string).then(() => {
                        document.cookie = `locale=${value};path=/;max-age=31536000`;
                        // this shouldn't be necessary, but it is due to the wide use of `...` in the codebase
                        window.location.reload();
                    })}
            />
        </>
    )
}
