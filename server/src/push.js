// Web Push (VAPID). Если ключей нет, пуши выключены: приложение работает как раньше, события приходят по сокету.
import webpush from 'web-push';

export function makePush({ publicKey, privateKey, subject = 'mailto:admin@example.com' }) {
  if (!publicKey || !privateKey) return null;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return {
    publicKey,
    // sub: { endpoint, p256dh, auth }. 404/410 от push-сервиса = подписка мертва, сервер её удалит
    async send(sub, payload) {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, JSON.stringify(payload), { TTL: 86400, urgency: 'normal' });
      } catch (e) { const g = e && (e.statusCode === 404 || e.statusCode === 410); const x = new Error(g ? 'gone' : 'push_failed'); x.gone = g; throw x; }
    },
  };
}
