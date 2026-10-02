# Nura Font Asset Directory

LifeKey uses **Nura** as its primary typeface across all headings, navigation, cards, buttons, dashboard components, and body copy.

The `@font-face` architecture in `globals.css` dynamically looks for:
- Local system installation of `Nura` (`local('Nura')`, `local('Nura-Bold')`, etc.)
- Webfont files placed here:
  - `Nura-Regular.woff2` (Weight 400)
  - `Nura-Medium.woff2` (Weight 500)
  - `Nura-SemiBold.woff2` (Weight 600)
  - `Nura-Bold.woff2` (Weight 700)
  - `Nura-ExtraBold.woff2` (Weight 800)
- Graceful fallbacks to modern geometric sans-serif stack while preserving exact font weights and metrics.
