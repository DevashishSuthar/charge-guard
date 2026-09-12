function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

/** Asks the browser for notification permission and registers a push subscription. */
export async function enablePushNotifications(): Promise<{ ok: boolean; error?: string }> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, error: "This browser doesn't support push notifications" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, error: "Notification permission was not granted" };
  }

  const keyRes = await fetch("/api/push/vapid-public-key");
  const { key } = await keyRes.json();
  if (!key) {
    return { ok: false, error: "Server push keys aren't configured yet" };
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(key),
  });

  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON()),
  });

  return { ok: true };
}
