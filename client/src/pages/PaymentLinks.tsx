import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function PaymentLinks() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);

  // Fetch payment links
  const { data: paymentLinks, refetch } = trpc.paymentLinks.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Link copiado!");
  };

  const getPaymentUrl = (slug: string) => `${window.location.origin}/pay/${slug}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-[#00ffff]";
      case "completed":
        return "text-[#00ff00]";
      case "expired":
        return "text-[#666]";
      default:
        return "text-[#aaa]";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "completed":
        return "Concluído";
      case "expired":
        return "Expirado";
      default:
        return status;
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
            <h1 className="text-3xl font-bold neon-pink">Meus Links de Pagamento</h1>
            <p className="text-[#aaa] mt-2">Gerencie seus links compartilháveis</p>
          </div>
          <Button
            onClick={() => setLocation("/payment-links/new")}
            className="cyberpunk-button flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Link
          </Button>
        </div>

        {/* Links Grid */}
        {paymentLinks && paymentLinks.length > 0 ? (
          <div className="space-y-4">
            {paymentLinks.map((link) => {
              const paymentUrl = getPaymentUrl(link.slug);
              const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
              const displayStatus = isExpired ? "expired" : link.status;

              return (
                <Card key={link.id} className="cyberpunk-card p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Link Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {link.amount} USDC
                          </h3>
                          {link.description && (
                            <p className="text-[#aaa] text-sm mb-3">{link.description}</p>
                          )}
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-sm border ${
                          displayStatus === "active"
                            ? "border-[#00ffff] text-[#00ffff]"
                            : displayStatus === "completed"
                            ? "border-[#00ff00] text-[#00ff00]"
                            : "border-[#666] text-[#666]"
                        }`}>
                          {getStatusLabel(displayStatus)}
                        </span>
                      </div>

                      {/* Link Display */}
                      <div className="bg-[#0a0a0a] p-3 rounded-sm border border-[#ff00ff]/30">
                        <p className="text-[#aaa] text-xs mb-2">Link Compartilhável:</p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-white font-mono text-xs truncate flex-1">
                            {paymentUrl}
                          </p>
                          <button
                            onClick={() => handleCopy(paymentUrl)}
                            className="p-2 hover:bg-[#ff00ff]/10 rounded-sm transition-colors flex-shrink-0"
                          >
                            {copied === paymentUrl ? (
                              <Check className="w-4 h-4 text-[#00ffff]" />
                            ) : (
                              <Copy className="w-4 h-4 text-[#aaa]" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 text-xs text-[#aaa]">
                        <span>ID: {link.slug}</span>
                        {link.expiresAt && (
                          <span>
                            Expira:{" "}
                            {new Date(link.expiresAt).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                        <span>
                          Criado:{" "}
                          {new Date(link.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() =>
                            selectedLink === link.slug
                              ? setSelectedLink(null)
                              : setSelectedLink(link.slug)
                          }
                          className="cyberpunk-button-outline text-sm px-3 py-1 flex items-center gap-2"
                        >
                          <Eye className="w-3 h-3" />
                          {selectedLink === link.slug ? "Ocultar" : "Ver"} QR
                        </Button>
                        <a
                          href={paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cyberpunk-button-outline text-sm px-3 py-1"
                        >
                          Abrir
                        </a>
                      </div>
                    </div>

                    {/* QR Code */}
                    {selectedLink === link.slug && (
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-white p-4 rounded-sm mb-3">
                          <QRCodeSVG value={paymentUrl} size={200} level="H" />
                        </div>
                        <p className="text-[#aaa] text-xs text-center">
                          Escaneie para pagar
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="cyberpunk-card p-12 text-center">
            <Plus className="w-12 h-12 text-[#ff00ff] opacity-50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Nenhum Link Criado
            </h3>
            <p className="text-[#aaa] mb-6">
              Comece criando um novo link de pagamento para receber USDC.
            </p>
            <Button
              onClick={() => setLocation("/payment-links/new")}
              className="cyberpunk-button"
            >
              Criar Primeiro Link
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
