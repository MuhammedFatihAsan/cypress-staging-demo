# cypress-staging-demo

Öğrenme demosu: Cypress ile E2E test + staging benzeri ortam + zamanlanmış koşturma + Google Chat bildirimi.

## Çalıştırma (Docker)
1) Uygulama:
   ```bash
   docker compose up --build app
   ```
   Tarayıcı: http://localhost:3000  (http://localhost:3000/env → {"env":"staging"})
2) Test:
   ```bash
   docker compose run --rm cypress
   ```

## GitHub Actions (zamanlanmış koşturma + Chat bildirimi)
- Secrets → Actions:
  - CY_BASE_URL (örn. https://staging.sizinapp.com ya da lokalde http://app:3000)
  - CY_WEBHOOK_BASE (genelde aynı)
  - GOOGLE_CHAT_WEBHOOK_URL (Chat odasından alınan incoming webhook)

## Testi bilerek patlatıp bildirimi denemek
- `cypress/e2e/chat-inbound.cy.js` dosyasında `cy.contains('Hoş geldin!')` ifadesini **başka bir metne** değiştirip push edin; workflow hata verince Google Chat’e mesaj düşer.
