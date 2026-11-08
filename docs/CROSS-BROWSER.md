# Cross-browser check

Tested on the deployed site, https://10x-shop-ana-altunashvili.vercel.app/, on 8 Nov 2026, in a private window of each browser on macOS (desktop).
Only what I really opened is marked.

| Flow | Chrome | Safari | Firefox |
| --- | --- | --- | --- |
| Catalog loads, search / category / sort / pagination | ✓ | ✓ | not tested |
| Product page, Add to cart | ✓ | ✓ | not tested |
| Cart, promo code | ✓ | ✓ | not tested |
| Login → Checkout → confirmation | ✓ | ✓ | not tested |
| Dark mode toggle, refresh keeps it | ✓ | ✓ | not tested |
| Direct open / refresh on `/products/5` | ✓ | ✓ | not tested |

Differences found: none noticed between Chrome and Safari (layout, fonts, buttons, colours and dark mode looked the same).

Not tested: Firefox, because it is not installed on my computer.

Note: the colour palette was changed after this check (PR #44, 8 Nov, about 23:00). Only colour values changed, and the flows above were not tested again in all browsers.
