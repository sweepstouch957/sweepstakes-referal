export function generateReferralCopy(storeName: string, referralLink: string) {
  // Extraer el código de referido de la URL (RF-XXXXXX)
  const match = referralLink.match(/referralcode=([A-Z0-9\-]+)/i);
  const code = match ? match[1] : "TuCódigo";

  // Emoji tienda
  const storeEmoji = "🏪";

  // Arma el texto bonito
  return (
    `¡${storeEmoji} ${storeName} te invita a participar!\n\n` +
    `Regístrate con mi código *${code}* y gana más oportunidades de ganar en Sweepstouch.\n\n` +
    `🔗 Link de registro: ${referralLink}`
  );
}