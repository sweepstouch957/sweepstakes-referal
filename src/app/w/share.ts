// Link y texto que comparte el referidor (WhatsApp / SMS / copiar) desde thank-you y Mis referidos.
// El link SIEMPRE va a /w de esta app (el backend arma el suyo con el confirmationLink del
// sorteo, que puede apuntar a otra landing). El texto sale de la config de la tienda
// (shareMessage, con {name} {store} {title} {minPurchase} {link}) o de un default que
// menciona el cupón cuando la recompensa está activa.
import type { ReferralRewardInfo } from "@/services/sweeptake.service";

export function optinReferralLink(referralCode: string, slug: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://st.sweepstouch.com";
  return `${origin}/w?referralcode=${encodeURIComponent(referralCode)}&slug=${encodeURIComponent(slug)}`;
}

export function buildShareText(
  reward: ReferralRewardInfo | null | undefined,
  v: { name?: string; store?: string; sweepstake?: string; link: string }
) {
  const store = (v.store || "la tienda").replace(/\s+\d.*$/, "").trim();
  if (reward?.shareMessage?.trim()) {
    const vars: Record<string, string> = {
      name: v.name || "",
      store,
      title: reward.title || "",
      minPurchase: String(reward.minPurchase ?? ""),
      link: v.link,
    };
    const out = reward.shareMessage.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
    return out.includes(v.link) ? out : `${out} ${v.link}`;
  }
  if (reward) {
    const min = reward.minPurchase > 0 ? ` (compra mín. $${reward.minPurchase})` : "";
    return `🎁 Regístrate en ${store} con mi código y entra al sorteo. Tu primera compra te da ${reward.title}${min}. Es gratis: ${v.link}`;
  }
  return `🎉 ¡Participa en ${v.sweepstake || "el sorteo"} de ${store}! Regístrate con mi código: ${v.link}`;
}
