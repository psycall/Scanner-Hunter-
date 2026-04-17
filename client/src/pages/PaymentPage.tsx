import { useParams, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { toast } from "sonner";

export default function PaymentPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Fetch payment link
  const { data: paymentLink, isLoading, error } = trpc.paymentLinks.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Fetch transactions for this link
  const { data: transactions } = trpc.transactions.getByPaymentLink.useQuery(
    { paymentLinkId: paymentLink?.id || 0 },
    { enabled: !!paymentLink?.id }
  );

  const handleConnectWallet = async () => {
    try {
      connect({ connector: injected() });
    } catch (error) {
      toast.error("Erro ao conectar carteira");
    }
  };

  const handlePayment = async () => {
    if (!isConnected || !address) {
      toast.error("Conecte sua carteira primeiro");
      return;
    }

    if (!paymentLink) {
      toast.error("Link de pagamento não encontrado");
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Implement actual payment transaction via viem
      toast.info("Funcionalidade de pagamento em desenvolvimento");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen cyberpunk-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ff00ff] animate-spin mx-auto mb-4" />
          <p className="text-[#aaa]">Carregando link de pagamento...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentLink) {
    return (
      <div className="min-h-screen cyberpunk-bg flex items-center justify-center p-4">
        <Card className="cyberpunk-card p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-[#ff00ff]" />
            <h1 className="text-2xl font-bold text-white">Link Inválido</h1>
          </div>
          <p className="text-[#aaa] mb-6">
            Este link de pagamento não existe ou expirou.
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="cyberpunk-button w-full"
          >
            Voltar para Home
          </Button>
        </Card>
      </div>
    );
  }

  // Check if link is expired
  const isExpired = paymentLink.expiresAt && new Date(paymentLink.expiresAt) < new Date();
  const isPaid = paymentLink.status === "completed";
  const isPending = paymentLink.status === "active" && !isExpired;

  // Get most recent transaction
  const recentTransaction = transactions?.[0];
  const isTransactionConfirmed = recentTransaction?.status === "confirmed";

  return (
    <div className="min-h-screen cyberpunk-bg overflow-hidden">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff00ff] via-transparent to-[#00ffff]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-[#ff00ff]/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => setLocation("/")}
            className="text-[#ff00ff] font-bold hover:text-[#00ffff] transition-colors"
          >
            ← Arc Pay
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Status Card */}
          <Card className="cyberpunk-card p-8 mb-6">
            <div className="text-center mb-6">
              {isTransactionConfirmed ? (
                <>
                  <CheckCircle className="w-16 h-16 text-[#00ffff] mx-auto mb-4" />
                  <h1 className="text-3xl font-bold neon-cyan mb-2">Pagamento Confirmado!</h1>
                  <p className="text-[#aaa]">Obrigado pela transação</p>
                </>
              ) : isPaid ? (
                <>
                  <CheckCircle className="w-16 h-16 text-[#ff00ff] mx-auto mb-4" />
                  <h1 className="text-3xl font-bold neon-pink mb-2">Pagamento Recebido</h1>
                  <p className="text-[#aaa]">Aguardando confirmação on-chain</p>
                </>
              ) : isExpired ? (
                <>
                  <Clock className="w-16 h-16 text-[#666] mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-[#666] mb-2">Link Expirado</h1>
                  <p className="text-[#aaa]">Este link de pagamento expirou</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#ff00ff] rounded-sm flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-black">$</span>
                  </div>
                  <h1 className="text-3xl font-bold neon-pink mb-2">Pagamento Solicitado</h1>
                  <p className="text-[#aaa]">Envie USDC para confirmar</p>
                </>
              )}
            </div>

            {/* Payment Details */}
            <div className="space-y-3 mb-6 pb-6 border-b border-[#ff00ff]/30">
              <div className="flex justify-between">
                <span className="text-[#aaa]">Valor:</span>
                <span className="text-white font-bold">{paymentLink.amount} USDC</span>
              </div>
              {paymentLink.description && (
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Descrição:</span>
                  <span className="text-white text-sm">{paymentLink.description}</span>
                </div>
              )}
              {paymentLink.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Expira em:</span>
                  <span className="text-white text-sm">
                    {new Date(paymentLink.expiresAt).toLocaleString("pt-BR")}
                  </span>
                </div>
              )}
            </div>

            {/* Wallet Connection */}
            {!isTransactionConfirmed && !isPaid && !isExpired && (
              <div className="space-y-4">
                {isConnected ? (
                  <>
                    <div className="bg-[#0a0a0a] p-3 rounded-sm border border-[#00ffff]/30">
                      <p className="text-[#aaa] text-xs mb-1">Carteira Conectada:</p>
                      <p className="text-white font-mono text-xs truncate">{address}</p>
                    </div>
                    <Button
                      onClick={handlePayment}
                      className="cyberpunk-button w-full"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processando..." : "Enviar Pagamento"}
                    </Button>
                    <Button
                      onClick={() => disconnect()}
                      className="cyberpunk-button-outline w-full"
                    >
                      Desconectar
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleConnectWallet}
                    className="cyberpunk-button w-full"
                  >
                    Conectar Carteira
                  </Button>
                )}
              </div>
            )}

            {/* Transaction Status */}
            {recentTransaction && (
              <div className="mt-6 pt-6 border-t border-[#ff00ff]/30">
                <p className="text-[#aaa] text-xs mb-2">Última Transação:</p>
                <div className="bg-[#0a0a0a] p-3 rounded-sm border border-[#00ffff]/30">
                  <p className="text-white font-mono text-xs truncate mb-1">
                    {recentTransaction.txHash || "Pendente"}
                  </p>
                  <p className={`text-xs font-semibold ${
                    recentTransaction.status === "confirmed"
                      ? "text-[#00ffff]"
                      : recentTransaction.status === "pending"
                      ? "text-[#ff00ff]"
                      : "text-[#666]"
                  }`}>
                    {recentTransaction.status === "confirmed"
                      ? "✓ Confirmado"
                      : recentTransaction.status === "pending"
                      ? "⏳ Pendente"
                      : "✗ Falhou"}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Network Info */}
          <Card className="cyberpunk-card p-4">
            <p className="text-[#aaa] text-xs text-center">
              Arc Testnet (Chain ID: 5042002) | USDC Payments
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
