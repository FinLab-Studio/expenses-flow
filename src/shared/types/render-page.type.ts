// A page cleanup: the router calls it when the user leaves the page
// (e.g. to destroy a Chart.js chart or remove a listener on `document`).
type PageCleanup = (() => void) | void;

// A page draws itself into `container`. It may be async (loads data from repositories)
// and may return a cleanup function.
export type RenderPage = (container: HTMLElement) => PageCleanup | Promise<PageCleanup>;
