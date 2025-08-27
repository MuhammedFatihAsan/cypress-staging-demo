// Basit bir Express uygulaması: chat mesajlarını tutar ve gösterir.
// Amaç: Cypress ile UI akışlarını test etmek ve inbound mesajı (webhook) simüle edebilmek.

const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

// ---- Ortam bilgisi (staging benzeri mi?)
const ENV = process.env.APP_ENV || 'dev';
app.get('/env', (req, res) => res.json({ env: ENV }));

// ---- Sağlık kontrolü: container hazır mı?
app.get('/health', (req, res) => res.status(200).send('ok'));

// ---- Statik frontend (public/index.html)
app.use(express.static(path.join(__dirname, 'public')));

// ---- Hafızada mesaj listesi (gerçek DB yerine demo amaçlı)
const messages = [];

// ---- Outbound: UI'dan mesaj gönderme
// Gerçekte buradan dış servise çağrı gidebilirdi (WhatsApp/Slack vb.).
// Demoda sadece 200 dönüp ID üretir; Cypress bunu intercept edip bekleyebilir.
app.post('/api/send', (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text required' });
  console.log('Outbound send:', text);
  return res.status(200).json({ id: `out-${Date.now()}`, ok: true });
});

// ---- Inbound: dış servis webhook'u gibi davranan endpoint
// Normalde sağlayıcı (ör. WhatsApp) bu endpoint'e POST atar.
// Testte ise bu endpoint'e POST'u BİZ atacağız (cy.task ile) => böylece kimse gerçek mesaj atmaz.
app.post('/webhook/inbound', (req, res) => {
  try {
    // Örnek payload şeması: fixtures/inbound.json'a bak
    const entry = req.body?.entry?.[0];
    const msg = entry?.changes?.[0]?.value?.messages?.[0];
    const body = msg?.text?.body || '(boş)';
    messages.push({ from: msg?.from || 'bot', body });
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('Webhook parse error', e);
    return res.status(400).json({ error: 'bad payload' });
  }
});

// ---- Test kolaylığı: elle mesaj enjekte eden endpoint
// (Gerekirse Postman/terminal ile hızlı deneme için)
app.post('/test-inject', (req, res) => {
  const { body = 'test', from = 'tester' } = req.body || {};
  messages.push({ from, body });
  return res.json({ ok: true });
});

// ---- UI'nın mesajları çektiği endpoint
app.get('/api/messages', (req, res) => {
  res.json({ messages });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Demo running on http://localhost:${PORT}`));
