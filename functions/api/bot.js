// Webhook Telegram-бота: /start /services /contacts /id
const REPLIES = {
  "/start":
    "Привет! Это Ride School SPB — сноуборд, SUP, ролики и коньки.\n\n/services — направления и цены\n/contacts — как с нами связаться\nЗаписаться можно на сайте ride-school-spb.ru",
  "/services":
    "• Сноуборд — 2 500 ₽ за час\n• Сапы — 2 000 ₽ за занятие\n• Ролики — 1 000 ₽ за занятие\n• Коньки — 1 000 ₽ за занятие\n\nАренда: сап-борд с веслом — 700 ₽ час, 2 500 ₽ день; электронасос — 500 ₽. Спасжилет к каждому сапу в подарок.",
  "/contacts":
    "Телефон: +7 981 882-08-88\nTelegram: @GordeeffPhoto\nMax: https://max.ru/u/f9LHodD0cOJ_UcgmDh1PoygO82yH6kYgnsktMBOxpq2aJs4omzDmRsvX6pQ",
};

export async function onRequestPost({ request, env }) {
  if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.WEBHOOK_SECRET)
    return new Response("forbidden", { status: 403 });

  const update = await request.json().catch(() => ({}));
  const msg = update.message;
  if (!msg || !msg.text) return new Response("ok");

  const cmd = msg.text.split(/[\s@]/)[0].toLowerCase();
  const text = cmd === "/id" ? `Ваш chat id: ${msg.chat.id}` : REPLIES[cmd];
  if (text) {
    await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: msg.chat.id, text, disable_web_page_preview: true }),
    });
  }
  return new Response("ok");
}
