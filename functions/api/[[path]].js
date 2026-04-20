// Version: 20260420_2106
// functions/api/[[path]].js

export async function onRequest({ request, env }) {
  try {
    // Klona det inkommande anropet från frontenden för att säkert modifiera det
    const proxiedRequest = new Request(request);

    // Lägg till den interna API-nyckeln (från miljövariablerna) i headern
    // Detta tillåter autentisering mot backenden utan att nyckeln exponeras i klienten
    proxiedRequest.headers.set("Authorization", env.INTERNAL_API_KEY);

    // Routa anropet direkt till Watchdog-backenden via Service Binding
    // Notera: WATCHDOG_WORKER är namnet på bindingen i inställningarna
    return await env.WATCHDOG_WORKER.fetch(proxiedRequest);

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internt proxyfel vid kommunikation med backend." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
