// Заявка с сайта -> сообщение в Telegram
export async function onRequestPost({ request, env }) {
  const json = (o, status = 200) =>
    new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });

  let d = {};
  try { d = await request.json(); } catch {}
  if (d.website) return json({ ok: true }); // ловушка для спам-ботов

  const name = String(d.name || "").trim().slice(0, 80);
  const phone = String(d.phone || "").trim().slice(0, 30);
  const direction = String(d.direction || "").trim().slice(0, 40) || "—";
  const comment = String(d.comment || "").trim().slice(0, 500) || "—";
  if (!name || phone.length < 6) return json({ ok: false, error: "Укажите имя и телефон" }, 400);
  if (!env.BOT_TOKEN || !env.CHAT_ID) return json({ ok: false, error: "Бот не настроен" }, 500);

  const text = `🏂 Новая заявка · Ride School SPB\n\nИмя: ${name}\nТелефон: ${phone}\nНаправление: ${direction}\nКомментарий: ${comment}`;
  const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.CHAT_ID, text }),
  });
  if (!r.ok) return json({ ok: false, error: "Не удалось отправить. Позвоните или напишите нам" }, 502);
  return json({ ok: true });
}
