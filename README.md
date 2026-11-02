# TalkToMe

TalkToMe is a static website for a listener and support service. It presents the service, 18 partner profiles, and a contact form that stores messages in Supabase.

The site is intentionally framework-free so it can be hosted directly on GitHub Pages.

## Tech stack

- HTML5
- CSS custom properties and responsive layout
- Vanilla JavaScript
- Supabase JavaScript SDK v2 (contact form only)
- GitHub Pages-compatible relative paths

There is no build step and no local dependency installation. The contact page loads the Supabase SDK from a CDN.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Home, service introduction, highlights, and three partner previews |
| `tentang.html` | About TalkToMe, vision, mission, and values |
| `partner.html` | All 18 partner profiles |
| `kontak.html` | Contact form and partner prefill |
| `berhasil.html` | Confirmation after a successful submission |

## Local preview

Serve the repository over HTTP rather than opening the HTML files directly. The Supabase SDK and browser security rules expect a normal web origin.

Using Python 3:

```powershell
python -m http.server 8080
```

Then open <http://localhost:8080>.

Alternatively, with Node.js:

```powershell
npx serve .
```

## Deploying to GitHub Pages

1. Commit the site files and push them to the repository's `main` branch.
2. In the GitHub repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder, then save.
5. GitHub will publish the site at `https://<account>.github.io/<repository>/`.

No build command, environment variables, or server runtime are required. Keep all asset references relative so the site also works from a project subpath.

## Supabase configuration

The contact form reads its configuration from the top of `assets/script.js`:

```js
const CONTACT_TABLE = 'Messages';
const SUPABASE_URL = 'https://<project>.supabase.co';
const SUPABASE_ANON_KEY = '<public-anon-key>';
```

### Expected table

The live project currently uses the `Messages` table with this shape:

| Column | Notes |
| --- | --- |
| `id` | Primary key |
| `name` | Visitor name |
| `email` | Visitor email |
| `message` | Message body |
| `created_at` | Creation timestamp |

The form inserts only `name`, `email`, and `message`. If the project is migrated to a different table, change `CONTACT_TABLE` in one place.

### Security and RLS

- The `anon` key is public by design in browser applications. It is not a secret.
- **Never** put a `service_role` key in this repository or in any browser-side file.
- Enable Row Level Security on `Messages`.
- Recommended policy: allow `INSERT` for the `anon` role, and deny `SELECT`, `UPDATE`, and `DELETE` from the browser client.
- View and manage submitted messages from the Supabase dashboard with a trusted account.
- Consider adding server-side rate limiting or CAPTCHA if spam becomes a problem. The current form relies on client-side validation only.

No database schema changes are made by this repository. The table name is configurable through `CONTACT_TABLE`.

## Contact form behaviour

- Custom client-side validation with inline field errors and a summary status.
- Clear loading state: disabled button, spinner, `aria-busy`, and “Mengirim...” label.
- Duplicate-submit guard while a request is pending.
- Success redirect to `berhasil.html`.
- Failure recovery: the error is announced, the button is re-enabled, and entered values are kept.
- Partner prefill from a URL such as `kontak.html?partner=Dr.%20Gia`. The partner name is sanitised, displayed in a notice, and inserted into the message with a real newline.
- Graceful message if the Supabase SDK fails to load.

## Accessibility and responsiveness

- Skip link to the main content.
- Landmarks, one `h1` per page, and a logical heading order.
- Visible keyboard focus styles and labelled form controls.
- `aria-current="page"` on the active navigation item.
- Mobile menu supports Escape to close, outside-click close, and focus return to the toggle.
- Status and error messages use live regions.
- `prefers-reduced-motion` support and print styles.
- Responsive layouts at desktop, laptop, tablet, and phone widths.
- Brand palette is centralised in `:root` in `assets/style.css`.

## Project structure

```text
.
├── index.html
├── tentang.html
├── partner.html
├── kontak.html
├── berhasil.html
├── assets/
│   ├── favicon.svg
│   ├── script.js
│   └── style.css
└── README.md
```

## Testing performed

The implementation was verified locally at 1440, 1280, 768, 390, and 360 pixel widths, plus a 320 pixel WCAG reflow check:

- 25 page/viewport combinations checked for console errors, page errors, failed requests, horizontal overflow, duplicate IDs, missing labels, heading order, active navigation state, and accessible control names. All pages also passed the 320 pixel reflow check.
- 10 axe-core accessibility scans (WCAG 2.0/2.1 A and AA) returned zero violations.
- Internal links and asset references were checked.
- Mobile menu opening, Escape, outside click, link click, and resize-to-desktop behaviour were tested.
- The contact form was tested with empty and invalid input, a real newline in the partner prefill, loading state, duplicate-submit prevention, a mocked successful insert, a mocked server failure, and a missing SDK.
- **No live row was inserted into Supabase.** Success and failure paths used intercepted requests only.

## Maintenance notes

- To add a partner, copy one `.partner-card` block in `partner.html` and update the initials, name, credentials, quote, and `?partner=` link. The Home page shows three selected partners and can be updated independently.
- The footer year is updated automatically by `assets/script.js`.
- If the site is moved to a different domain or table, update the constants at the top of `assets/script.js`.
- There is no WhatsApp integration, admin inbox UI, or server-side form handler in this project.
