import {t} from "@lingui/macro";
import classes from "./FloatingPoweredBy.module.scss";
import classNames from "classnames";
import React from "react";
import {iHavePurchasedALicence, isHiEvents} from "../../../utilites/helpers.ts";

/**
 * (c) iCrawn.Events Ltd 2025
 *
 * PLEASE NOTE:
 *
 * iCrawn.Events is licensed under the GNU Affero General Public License (AGPL) version 3.
 *
 * You can find the full license text at: https://github.com/HiEventsDev/iCrawn.Events/blob/main/LICENCE
 *
 * In accordance with Section 7(b) of the AGPL, you must retain the "Powered by iCrawn.Events" notice.
 *
 * If you wish to remove this notice, a commercial license is available at: https://iCrawn.Events/licensing
 */
export const PoweredByFooter = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
    if (iHavePurchasedALicence()) {
        return <></>;
    }

    const footerContent = isHiEvents() ? (
        <>
            {`Planning an event?`} {' '}
            <a href="https://iCrawn.Events?utm_source=app-powered-by-footer&utm_content=try-hi-events-free"
               target="_blank"
               className={classes.ctaLink}
               title={'Effortlessly manage events and sell tickets online with iCrawn.Events'}>
                {`Try iCrawn.Events Free`}
            </a>
        </>
    ) : (
        <>
            {`Powered by`} {' '}
            <a href="https://iCrawn.Events?utm_source=app-powered-by-footer"
               target="_blank"
               title={'Effortlessly manage events and sell tickets online with iCrawn.Events'}>
                {`iCrawn.Events`}
            </a> 🚀
        </>
    );

    return (
        <div {...props} className={classNames(classes.poweredBy, props.className)}>
            <div className={classes.poweredByText}>
                {footerContent}
            </div>
        </div>
    );
}
