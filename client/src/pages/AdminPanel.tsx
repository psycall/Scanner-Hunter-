import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Users, TrendingUp, Activity } from "lucide-react";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Fetch admin data
  const { data: allUsers, isLoading: usersLoading } = trpc.admin.getAllUsers.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: allTransactions, isLoading: transactionsLoading } = trpc.admin.getAllTransactions.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }

    if (user?.role !== "admin") {
      toast.error("Acesso negado. Apenas administradores podem acessar.");
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, setLocation]);

  if (!user || !isAuthenticated || user.role !== "admin") {
    return null;
  }

  const totalUsers = allUsers?.length || 0;
  const totalTransactions = allTransactions?.length || 0;
  const confirmedTransactions = allTransactions?.filter((t: any) => t.status === "confirmed").length || 0;
  const totalVolume = allTransactions?.reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold neon-pink">Painel Administrativo</h1>
            <p className="text-[#aaa] mt-2">Gerenciamento da plataforma Arc Pay</p>
          </div>
          <Button
            onClick={() => setLocation("/dashboard")}
            className="cyberpunk-button-outline"
          >
            Voltar
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <Card className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#aaa] font-semibold">Usuários</h3>
              <Users className="w-5 h-5 neon-cyan" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{totalUsers}</p>
            <p className="text-[#666] text-xs">Total na plataforma</p>
          </Card>

          {/* Total Transactions */}
          <Card className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#aaa] font-semibold">Transações</h3>
              <Activity className="w-5 h-5 neon-pink" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{totalTransactions}</p>
            <p className="text-[#666] text-xs">Total registradas</p>
          </Card>

          {/* Confirmed Transactions */}
          <Card className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#aaa] font-semibold">Confirmadas</h3>
              <TrendingUp className="w-5 h-5 text-[#00ff00]" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{confirmedTransactions}</p>
            <p className="text-[#666] text-xs">On-chain confirmadas</p>
          </Card>

          {/* Total Volume */}
          <Card className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#aaa] font-semibold">Volume</h3>
              <TrendingUp className="w-5 h-5 neon-cyan" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{totalVolume.toFixed(2)}</p>
            <p className="text-[#666] text-xs">USDC movimentado</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-[#ff00ff]/30">
          <button
            onClick={() => setSelectedTab("users")}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedTab === "users"
                ? "text-[#ff00ff] border-b-2 border-[#ff00ff]"
                : "text-[#aaa] hover:text-white"
            }`}
          >
            Usuários
          </button>
          <button
            onClick={() => setSelectedTab("transactions")}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedTab === "transactions"
                ? "text-[#ff00ff] border-b-2 border-[#ff00ff]"
                : "text-[#aaa] hover:text-white"
            }`}
          >
            Transações
          </button>
        </div>

        {/* Content */}
        {selectedTab === "users" && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 neon-cyan">
              Usuários da Plataforma
            </h3>
            {usersLoading ? (
              <Card className="cyberpunk-card p-8 text-center">
                <p className="text-[#aaa]">Carregando usuários...</p>
              </Card>
            ) : allUsers && allUsers.length > 0 ? (
              <div className="space-y-3">
                {allUsers.map((u: any) => (
                  <Card key={u.id} className="cyberpunk-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">{u.name || u.email || "Sem nome"}</p>
                        <p className="text-[#aaa] text-xs font-mono truncate">{u.email}</p>
                        <p className="text-[#666] text-xs mt-1">
                          ID: {u.openId} | Criado: {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-sm border ${
                        u.role === "admin"
                          ? "border-[#ff00ff] text-[#ff00ff]"
                          : "border-[#00ffff] text-[#00ffff]"
                      }`}>
                        {u.role === "admin" ? "Admin" : "Usuário"}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="cyberpunk-card p-8 text-center">
                <p className="text-[#666]">Nenhum usuário encontrado</p>
              </Card>
            )}
          </div>
        )}

        {selectedTab === "transactions" && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 neon-cyan">
              Todas as Transações
            </h3>
            {transactionsLoading ? (
              <Card className="cyberpunk-card p-8 text-center">
                <p className="text-[#aaa]">Carregando transações...</p>
              </Card>
            ) : allTransactions && allTransactions.length > 0 ? (
              <div className="space-y-3">
                {allTransactions.map((tx: any) => (
                  <Card key={tx.id} className="cyberpunk-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">{tx.amount} USDC</p>
                        <p className="text-[#aaa] text-xs font-mono truncate">
                          Link ID: {tx.paymentLinkId}
                        </p>
                        <p className="text-[#666] text-xs mt-1">
                          {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-sm border ${
                        tx.status === "confirmed"
                          ? "border-[#00ff00] text-[#00ff00]"
                          : tx.status === "pending"
                          ? "border-[#ff00ff] text-[#ff00ff]"
                          : "border-[#666] text-[#666]"
                      }`}>
                        {tx.status === "confirmed"
                          ? "✓ Confirmado"
                          : tx.status === "pending"
                          ? "⏳ Pendente"
                          : "✗ Falhou"}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="cyberpunk-card p-8 text-center">
                <p className="text-[#666]">Nenhuma transação encontrada</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
