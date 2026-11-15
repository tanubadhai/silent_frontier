import { useEffect } from "react";

const SITE_TITLE = "The Silent Frontier";

/** Sets the browser tab title for the current page. */
export default function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | ${SITE_TITLE}` : `${SITE_TITLE} | STARSTUFF`;
  }, [pageTitle]);
}
