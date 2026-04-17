import { notifyOwner } from "./_core/notification";

/**
 * Notify owner and payment link creator when a payment is confirmed on-chain
 */
export async function notifyPaymentConfirmed(
  paymentLinkCreatorId: number,
  amount: string,
  txHash: string,
  paymentLinkSlug: string
) {
  try {
    // Notify owner
    await notifyOwner({
      title: "💰 Pagamento Confirmado na Arc Testnet",
      content: `Um pagamento de ${amount} USDC foi confirmado on-chain.\n\nLink: ${paymentLinkSlug}\nTx: ${txHash}`,
    });

    // TODO: Notify payment link creator
    // This would require storing user contact info or using a separate notification system
    console.log(`[Notification] Payment confirmed for link creator ${paymentLinkCreatorId}`);
  } catch (error) {
    console.error("[Notification] Failed to send payment confirmation:", error);
  }
}

/**
 * Notify owner of new payment link creation
 */
export async function notifyNewPaymentLink(
  creatorName: string,
  amount: string,
  paymentLinkSlug: string
) {
  try {
    await notifyOwner({
      title: "🔗 Novo Link de Pagamento Criado",
      content: `${creatorName} criou um novo link de pagamento.\n\nValor: ${amount} USDC\nLink: ${paymentLinkSlug}`,
    });
  } catch (error) {
    console.error("[Notification] Failed to send new link notification:", error);
  }
}

/**
 * Notify owner of payment link expiration
 */
export async function notifyPaymentLinkExpired(
  amount: string,
  paymentLinkSlug: string
) {
  try {
    await notifyOwner({
      title: "⏰ Link de Pagamento Expirado",
      content: `Um link de pagamento expirou sem ser pago.\n\nValor: ${amount} USDC\nLink: ${paymentLinkSlug}`,
    });
  } catch (error) {
    console.error("[Notification] Failed to send expiration notification:", error);
  }
}
