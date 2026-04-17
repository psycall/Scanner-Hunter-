import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, TrendingUp, Clock } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Fetch user data
  const { data: wallets } = trpc.wallets.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: paymentLinks } = trpc.paymentLinks.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!user || !isAuthenticated) {
    return null;
  }

  const defaultWallet = wallets?.[0];
  const totalLinks = paymentLinks?.length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold neon-pink">Dashboard</h1>
            <p className="text-[#aaa] mt-2">Bem-vindo, {user.name || user.email}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setLocation("/wallets")}
              className="cyberpunk-button flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" /> Carteiras
            </Button>
            <Button
              onClick={() => setLocation("/payment-links/new")}
              className="cyberpunk-button flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Novo Link
            </Button>
          </div>
        </div>

        {/* Admin Link */}
        {user.role === "admin" && (
          <div className="bg-[#ff00ff]/10 border border-[#ff00ff] rounded-sm p-4">
            <p className="text-[#ff00ff] text-sm mb-2">👑 Você é administrador</p>
            <button
              onClick={() => setLocation("/admin")}
              className="cyberpunk-button text-sm w-full"
            >
              Ir para Painel Admin
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Wallet Card */}
          <Card className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#aaa] font-semibold">Carteira Principal</h3>
              <Wallet className="w-5 h-5 neon-pink" />
            </div>
            {defaultWallet ? (
              <div>
                <p className="text-white font-mono text-sm truncate mb-2">
                  {defaultWallet.address}
                </p>
                <p className="text-[#00ffff] text-xs">Arc Testnet</p>
              </div>
            ) : (
              <p className="text-[#666] text-sm">Nenhuma carteira configurada</p>
            )}
          </Card>

          {/* Payment Links Card */}
          <Card className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#aaa] font-semibold">Links de Pagamento</h3>
              <TrendingUp className="w-5 h-5 neon-cyan" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{totalLinks}</p>
            <p className="text-[#666] text-xs">Ativos</p>
          </Card>

          {/* Recent Activity Card */}
          <Card className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#aaa] font-semibold">Atividade</h3>
              <Clock className="w-5 h-5 neon-pink" />
            </div>
            <p className="text-white font-mono text-sm">
              {new Date().toLocaleDateString("pt-BR")}
            </p>
            <p className="text-[#666] text-xs mt-2">Última atualização</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-[#ff00ff]/30">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedTab === "overview"
                ? "text-[#ff00ff] border-b-2 border-[#ff00ff]"
                : "text-[#aaa] hover:text-white"
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setSelectedTab("recent")}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedTab === "recent"
                ? "text-[#ff00ff] border-b-2 border-[#ff00ff]"
                : "text-[#aaa] hover:text-white"
            }`}
          >
            Transações Recentes
          </button>
        </div>

        {/* Content */}
        {selectedTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card className="cyberpunk-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 neon-cyan">
                Ações Rápidas
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => setLocation("/wallets")}
                  className="w-full cyberpunk-button-outline justify-start"
                >
                  Gerenciar Carteiras
                </Button>
                <Button
                  onClick={() => setLocation("/payment-links")}
                  className="w-full cyberpunk-button-outline justify-start"
                >
                  Meus Links de Pagamento
                </Button>
                <Button
                  onClick={() => setLocation("/transactions")}
                  className="w-full cyberpunk-button-outline justify-start"
                >
                  Histórico de Transações
                </Button>
              </div>
            </Card>

            {/* Network Info */}
            <Card className="cyberpunk-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 neon-pink">
                Informações da Rede
              </h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Chain ID:</span>
                  <span className="text-[#00ffff]">5042002</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Moeda:</span>
                  <span className="text-[#ff00ff]">USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">RPC:</span>
                  <span className="text-[#00ffff] text-xs truncate">
                    rpc.testnet.arc.network
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Explorer:</span>
                  <a
                    href="https://testnet.arcscan.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff00ff] hover:underline"
                  >
                    Arcscan
                  </a>
                </div>
              </div>
            </Card>
          </div>
        )}

        {selectedTab === "recent" && (
          <Card className="cyberpunk-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Transações Recentes
            </h3>
            <p className="text-[#666]">
              Nenhuma transação encontrada. Crie um link de pagamento para começar.
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
