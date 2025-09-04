import { PropsWithChildren } from "react";
import PublicNavbar from "../../common/PublicNavbar";

export default function PublicSiteLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  );
}
