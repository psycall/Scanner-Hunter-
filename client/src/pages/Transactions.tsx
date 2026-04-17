import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { ARC_CONFIG } from "@/lib/arc-testnet";

export default function Transactions() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Fetch transactions
  const { data: transactions, isLoading } = trpc.transactions.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-[#00ff00]" />;
      case "pending":
        return <Clock className="w-5 h-5 text-[#ff00ff]" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-[#ff0000]" />;
      default:
        return <Clock className="w-5 h-5 text-[#aaa]" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "failed":
        return "Falhou";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-[#00ff00]";
      case "pending":
        return "text-[#ff00ff]";
      case "failed":
        return "text-[#ff0000]";
      default:
        return "text-[#aaa]";
    }
  };

  const filteredTransactions = selectedStatus
    ? transactions?.filter((t: any) => t.status === selectedStatus)
    : transactions;

  if (!user || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold neon-pink">Histórico de Transações</h1>
            <p className="text-[#aaa] mt-2">Acompanhe todos os seus pagamentos</p>
          </div>
          <Button
            onClick={() => setLocation("/dashboard")}
            className="cyberpunk-button-outline"
          >
            Voltar
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setSelectedStatus(null)}
            className={`text-sm px-4 py-2 rounded-sm border transition-colors ${
              selectedStatus === null
                ? "bg-[#ff00ff] text-black border-[#ff00ff]"
                : "border-[#ff00ff]/30 text-[#aaa] hover:text-white"
            }`}
          >
            Todos
          </Button>
          <Button
            onClick={() => setSelectedStatus("confirmed")}
            className={`text-sm px-4 py-2 rounded-sm border transition-colors ${
              selectedStatus === "confirmed"
                ? "bg-[#00ff00] text-black border-[#00ff00]"
                : "border-[#00ff00]/30 text-[#aaa] hover:text-white"
            }`}
          >
            Confirmados
          </Button>
          <Button
            onClick={() => setSelectedStatus("pending")}
            className={`text-sm px-4 py-2 rounded-sm border transition-colors ${
              selectedStatus === "pending"
                ? "bg-[#ff00ff] text-black border-[#ff00ff]"
                : "border-[#ff00ff]/30 text-[#aaa] hover:text-white"
            }`}
          >
            Pendentes
          </Button>
          <Button
            onClick={() => setSelectedStatus("failed")}
            className={`text-sm px-4 py-2 rounded-sm border transition-colors ${
              selectedStatus === "failed"
                ? "bg-[#ff0000] text-black border-[#ff0000]"
                : "border-[#ff0000]/30 text-[#aaa] hover:text-white"
            }`}
          >
            Falhados
          </Button>
        </div>

        {/* Transactions List */}
        {isLoading ? (
          <Card className="cyberpunk-card p-8 text-center">
            <p className="text-[#aaa]">Carregando transações...</p>
          </Card>
        ) : filteredTransactions && filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map((transaction: any) => (
              <Card key={transaction.id} className="cyberpunk-card p-4 hover:shadow-[0_0_20px_rgba(255,0,255,0.2)] transition-all">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Icon & Amount */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-bold">
                        {transaction.amount} USDC
                      </p>
                      <p className="text-[#aaa] text-xs truncate">
                        {transaction.paymentLinkId ? `Link #${transaction.paymentLinkId}` : "Transação"}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status & Date */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${getStatusColor(transaction.status)}`}>
                        {getStatusLabel(transaction.status)}
                      </p>
                      <p className="text-[#aaa] text-xs">
                        {new Date(transaction.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    {/* Explorer Link */}
                    {transaction.txHash && (
                      <a
                        href={`${ARC_CONFIG.explorerUrl}/tx/${transaction.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-[#ff00ff]/10 rounded-sm transition-colors"
                        title="Ver no Arcscan"
                      >
                        <ExternalLink className="w-4 h-4 text-[#00ffff]" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Details */}
                {transaction.txHash && (
                  <div className="mt-3 pt-3 border-t border-[#ff00ff]/20">
                    <p className="text-[#aaa] text-xs">
                      Hash: <span className="text-white font-mono">{transaction.txHash.slice(0, 20)}...</span>
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="cyberpunk-card p-12 text-center">
            <AlertCircle className="w-12 h-12 text-[#ff00ff] opacity-50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Nenhuma Transação
            </h3>
            <p className="text-[#aaa] mb-6">
              {selectedStatus
                ? "Nenhuma transação encontrada com este status."
                : "Você ainda não tem transações. Crie um link de pagamento para começar."}
            </p>
            <Button
              onClick={() => setLocation("/payment-links/new")}
              className="cyberpunk-button"
            >
              Criar Link de Pagamento
            </Button>
          </Card>
        )}

        {/* Network Info */}
        <Card className="cyberpunk-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 neon-cyan">
            Informações da Rede
          </h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-[#aaa]">Chain ID:</span>
              <span className="text-[#ff00ff]">{ARC_CONFIG.chainId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#aaa]">Explorer:</span>
              <a
                href={ARC_CONFIG.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ffff] hover:underline"
              >
                Arcscan
              </a>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
