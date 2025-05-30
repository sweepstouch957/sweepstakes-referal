export function generateReferralCopy(storeName: string, referralLink: string) {
  // Extraer el código de referido de la URL (RF-XXXXXX)
  const match = referralLink.match(/referralcode=([A-Z0-9\-]+)/i);
  const code = match ? match[1] : "TuCódigo";

  // Emoji tienda
  const storeEmoji = "🏪";

  // Arma el texto bonito
  return (
    `¡${storeEmoji} ${storeName} te invita a participar!\n\n` +
    `Regístrate con mi código *${code}* y participa para ganar un Nissan Versa 2025.\n\n` +
    `🔗 Link de registro: ${referralLink}`
  );
}

export function shareOnWhatsApp(storeName: string, referralLink: string) {
  const msg = encodeURIComponent(generateReferralCopy(storeName, referralLink));
  const url = `https://wa.me/?text=${msg}`;
  window.open(url, "_blank");
}

export function shareOnFacebook(storeName: string, referralLink: string) {
  const quote = encodeURIComponent(
    `¡Participa en el sorteo de ${storeName}! Regístrate con este link para ganar un Nissan Versa 2025!.`
  );
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    referralLink
  )}&quote=${quote}`;
  window.open(url, "_blank");
}
