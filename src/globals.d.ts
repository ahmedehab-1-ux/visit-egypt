// Optional runtime injected when the page is hosted as a Claude artifact.
// Outside that host it is undefined and the concierge falls back to the
// built-in rule-based trip engine (see app.ts, "SAMPLE").
declare const claude: any;
