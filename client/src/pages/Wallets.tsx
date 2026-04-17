import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Plus, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Endereço Ethereum inválido");

export default function Wallets() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [newAddress, setNewAddress] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch wallets
  const { data: wallets, refetch } = trpc.wallets.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Add wallet mutation
  const addWalletMutation = trpc.wallets.add.useMutation({
    onSuccess: () => {
      toast.success("Carteira adicionada com sucesso!");
      setNewAddress("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao adicionar carteira");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      addressSchema.parse(newAddress);
      setIsLoading(true);
      await addWalletMutation.mutateAsync({
        address: newAddress,
        isDefault: !wallets || wallets.length === 0,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0]?.message || "Erro de validação");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(null), 2000);
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
            <h1 className="text-3xl font-bold neon-pink">Gerenciar Carteiras</h1>
            <p className="text-[#aaa] mt-2">Arc Testnet (Chain ID: 5042002)</p>
          </div>
          <Button
            onClick={() => setLocation("/dashboard")}
            className="cyberpunk-button-outline"
          >
            Voltar
          </Button>
        </div>

        {/* Add Wallet Form */}
        <Card className="cyberpunk-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 neon-cyan">
            Adicionar Nova Carteira
          </h3>
          <form onSubmit={handleAddWallet} className="space-y-4">
            <div>
              <label className="block text-[#aaa] text-sm font-semibold mb-2">
                Endereço Ethereum (0x...)
              </label>
              <Input
                type="text"
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="cyberpunk-input"
                disabled={isLoading}
              />
              <p className="text-[#666] text-xs mt-2">
                Insira um endereço de carteira válido na Arc Testnet
              </p>
            </div>
            <Button
              type="submit"
              className="cyberpunk-button w-full flex items-center justify-center gap-2"
              disabled={isLoading || !newAddress}
            >
              <Plus className="w-4 h-4" />
              {isLoading ? "Adicionando..." : "Adicionar Carteira"}
            </Button>
          </form>
        </Card>

        {/* Wallets List */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 neon-pink">
            Minhas Carteiras ({wallets?.length || 0})
          </h3>
          {wallets && wallets.length > 0 ? (
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <Card key={wallet.id} className="cyberpunk-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-[#ff00ff] rounded-sm flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-5 h-5 text-black" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-mono text-sm truncate">
                          {wallet.address}
                        </p>
                        {wallet.isDefault && (
                          <p className="text-[#00ffff] text-xs">Carteira Principal</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(wallet.address)}
                      className="ml-2 p-2 hover:bg-[#ff00ff]/10 rounded-sm transition-colors"
                    >
                      {copied === wallet.address ? (
                        <Check className="w-4 h-4 text-[#00ffff]" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#aaa]" />
                      )}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="cyberpunk-card p-6">
              <p className="text-[#666] text-center">
                Nenhuma carteira configurada. Adicione uma acima para começar.
              </p>
            </Card>
          )}
        </div>

        {/* Network Info */}
        <Card className="cyberpunk-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 neon-pink">
            Informações da Rede
          </h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-[#aaa]">Chain ID:</span>
              <span className="text-[#00ffff]">5042002</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#aaa]">RPC:</span>
              <span className="text-[#ff00ff] text-xs">
                https://rpc.testnet.arc.network
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#aaa]">Faucet:</span>
              <a
                href="https://faucet.circle.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ffff] hover:underline"
              >
                Circle Faucet
              </a>
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
    </DashboardLayout>
  );
}
