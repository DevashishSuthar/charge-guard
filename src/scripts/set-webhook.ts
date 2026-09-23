import "dotenv/config";

/**
 * Run once after deploying: `npm run set-webhook`
 * Tells Telegram where to send updates, and sets the secret token
 * Telegram will echo back on every request so our route can verify it.
 */
async function main() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const appUrl = process.env.PUBLIC_APP_URL;
    const pathSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    const headerSecret = process.env.TELEGRAM_WEBHOOK_HEADER_SECRET;

    const missing = Object.entries({
        TELEGRAM_BOT_TOKEN: token,
        PUBLIC_APP_URL: appUrl,
        TELEGRAM_WEBHOOK_SECRET: pathSecret,
        TELEGRAM_WEBHOOK_HEADER_SECRET: headerSecret,
    })
        .filter(([, v]) => !v)
        .map(([k]) => k);

    if (missing.length > 0) {
        console.error(`Missing env vars: ${missing.join(", ")}`);
        process.exit(1);
    }

    const webhookUrl = `${appUrl!.replace(/\/$/, "")}/api/telegram/webhook/${pathSecret}`;

    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl, secret_token: headerSecret }),
    });

    const data = await res.json();

    if (!data.ok) {
        console.error("Telegram rejected the request:", data);
        process.exit(1);
    }

    console.log("Webhook set successfully.");
    console.log(`  URL: ${webhookUrl}`);
    console.log(`  Telegram says: ${data.description}`);
}

main();