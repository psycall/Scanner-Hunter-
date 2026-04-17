import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Zap } from "lucide-react";
import { toast } from "sonner";

export default function CreatePaymentLink() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [createdLink, setCreatedLink] = useState<{ slug: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Create payment link mutation
  const createLinkMutation = trpc.paymentLinks.create.useMutation({
    onSuccess: (result: any) => {
      const url = `${window.location.origin}/pay/${result.slug}`;
      setCreatedLink({ slug: result.slug, url });
      toast.success("Link de pagamento criado com sucesso!");
      setAmount("");
      setDescription("");
      setExpiresAt("");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar link de pagamento");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Insira um valor válido");
      return;
    }

    try {
      setIsLoading(true);
      await createLinkMutation.mutateAsync({
        amount,
        description: description || undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copiado!");
    }
  };

  if (!user || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold neon-pink">Novo Link de Pagamento</h1>
            <p className="text-[#aaa] mt-2">Crie um link compartilhável para receber USDC</p>
          </div>
          <Button
            onClick={() => setLocation("/dashboard")}
            className="cyberpunk-button-outline"
          >
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card className="cyberpunk-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 neon-cyan">
              Detalhes do Pagamento
            </h3>
            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label className="block text-[#aaa] text-sm font-semibold mb-2">
                  Valor em USDC *
                </label>
                <Input
                  type="number"
                  step="0.000001"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="cyberpunk-input"
                  disabled={isLoading || !!createdLink}
                />
              </div>

              <div>
                <label className="block text-[#aaa] text-sm font-semibold mb-2">
                  Descrição (opcional)
                </label>
                <Textarea
                  placeholder="Ex: Pagamento de serviços..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="cyberpunk-input"
                  disabled={isLoading || !!createdLink}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-[#aaa] text-sm font-semibold mb-2">
                  Data de Expiração (opcional)
                </label>
                <Input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="cyberpunk-input"
                  disabled={isLoading || !!createdLink}
                />
              </div>

              {!createdLink ? (
                <Button
                  type="submit"
                  className="cyberpunk-button w-full flex items-center justify-center gap-2"
                  disabled={isLoading || !amount}
                >
                  <Zap className="w-4 h-4" />
                  {isLoading ? "Criando..." : "Criar Link"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setCreatedLink(null);
                    setAmount("");
                    setDescription("");
                    setExpiresAt("");
                  }}
                  className="cyberpunk-button-outline w-full"
                >
                  Criar Outro Link
                </Button>
              )}
            </form>
          </Card>

          {/* QR Code & Link */}
          {createdLink ? (
            <Card className="cyberpunk-card p-6 flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold text-white mb-4 neon-pink text-center">
                Link Criado!
              </h3>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-sm mb-6">
                <QRCodeSVG value={createdLink.url} size={256} level="H" />
              </div>

              {/* Link */}
              <div className="w-full space-y-3">
                <div className="bg-[#0a0a0a] p-3 rounded-sm border border-[#ff00ff]/30">
                  <p className="text-[#aaa] text-xs mb-2">Link Compartilhável:</p>
                  <p className="text-white font-mono text-xs truncate">
                    {createdLink.url}
                  </p>
                </div>

                <Button
                  onClick={handleCopy}
                  className="cyberpunk-button w-full flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copiar Link
                    </>
                  )}
                </Button>

                <a
                  href={createdLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyberpunk-button-outline w-full text-center block"
                >
                  Visualizar Link
                </a>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-[#0a0a0a] border border-[#00ffff]/30 rounded-sm w-full">
                <p className="text-[#aaa] text-xs">
                  Compartilhe este link ou QR code para receber pagamentos em USDC.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="cyberpunk-card p-6 flex flex-col items-center justify-center text-center">
              <Zap className="w-12 h-12 text-[#ff00ff] mb-4 opacity-50" />
              <p className="text-[#aaa]">
                Preencha os detalhes ao lado e clique em "Criar Link" para gerar um QR code compartilhável.
              </p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
