// Cypress ana ayarları. Burada:
// - baseUrl: testlerin açacağı temel adres (Docker içinde app servisine gider)
// - env: inbound webhook'a POST atmak için temel URL
// - setupNodeEvents: testten "cy.task" ile Node tarafında HTTP talebi atabilmemizi sağlar

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CY_BASE_URL || 'http://localhost:3000',
    env: {
      WEBHOOK_BASE: process.env.CY_WEBHOOK_BASE || 'http://localhost:3000',
    },
    setupNodeEvents(on, config) {
      on('task', {
        async sendInboundWebhook(payload) {
          // Node 18+ içinde fetch global mevcut; yoksa node-fetch kurman gerekir.
          const res = await fetch(`${config.env.WEBHOOK_BASE}/webhook/inbound`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          });
          return res.ok;
        },
      });
      return config;
    },
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
  },
});
