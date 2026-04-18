# Lighthouse Diagnostics (All Routes)

Base URL: http://127.0.0.1:4175
Generated at: 2026-04-17T17:21:17.494Z

| Route | Status | Performance | Accessibilite | Bonnes pratiques | SEO |
| --- | --- | ---: | ---: | ---: | ---: |
| / | ok | 78 | 90 | 100 | 92 |
| /login | ok-with-warning | 89 | 86 | 100 | 92 |
| /reset-password | ok-with-warning | 97 | 62 | 100 | 92 |
| /agent/login | ok-with-warning | 97 | 80 | 100 | 92 |
| /agent/reset-password | ok-with-warning | 97 | 62 | 100 | 92 |
| /agent/change-password | ok-with-warning | 97 | 62 | 100 | 92 |
| /agent/dashboard | ok-with-warning | 90 | 80 | 100 | 92 |
| /agent/admin | ok-with-warning | 95 | 80 | 100 | 92 |
| /signin | ok-with-warning | 87 | 98 | 100 | 92 |
| /faq | ok-with-warning | 96 | 81 | 100 | 92 |
| /user-guides | ok-with-warning | 89 | 90 | 100 | 92 |
| /support-center | ok-with-warning | 91 | 83 | 100 | 92 |
| /privacy-policy | ok-with-warning | 90 | 83 | 100 | 92 |
| /terms-of-service | ok-with-warning | 91 | 83 | 100 | 92 |
| /security | ok-with-warning | 91 | 83 | 100 | 92 |
| /quest | ok-with-warning | 97 | 97 | 100 | 92 |
| /client | ok-with-warning | 87 | 87 | 96 | 92 |
| /dashboard | ok-with-warning | 94 | 87 | 96 | 92 |
| /dashboard/profile | ok-with-warning | 92 | 100 | 96 | 92 |
| /dashboard/chatbot | ok-with-warning | 95 | 88 | 96 | 92 |
| /dashboard/products | ok-with-warning | 79 | 93 | 96 | 92 |
| /dashboard/product-comparator | ok-with-warning | 91 | 93 | 96 | 92 |
| /dashboard/simulator | ok | 89 | 100 | 96 | 92 |
| /dashboard/budget | ok-with-warning | 81 | 100 | 92 | 92 |
| /dashboard/reclamation | ok-with-warning | 92 | 100 | 92 | 92 |
| /dashboard/parametres | ok-with-warning | 95 | 100 | 96 | 92 |

Failed routes: 0
Routes with warnings: 24

## Notes

- Les routes protegees (ex: dashboard, agent/admin) peuvent etre mesurees sur leur etat de redirection si non authentifie.
- Pour auditer une session authentifiee, il faut injecter l'etat/cookies avant l'audit.
