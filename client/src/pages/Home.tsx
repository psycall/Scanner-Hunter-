import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { ArrowRight, Zap, Lock, TrendingUp } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated && user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen cyberpunk-bg overflow-hidden">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff00ff] via-transparent to-[#00ffff]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-[#ff00ff]/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#ff00ff] rounded-sm flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold neon-pink">ARC PAY</span>
          </div>
          <a href={getLoginUrl()} className="cyberpunk-button">
            ENTRAR
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Animated Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="neon-pink">PAGAMENTOS</span>
            <br />
            <span className="neon-cyan">EM USDC</span>
            <br />
            <span className="text-white">NA ARC TESTNET</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-[#aaa] mb-8 max-w-2xl mx-auto">
            Plataforma de pagamentos descentralizada com links compartilháveis, QR codes e verificação on-chain em tempo real.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href={getLoginUrl()} className="cyberpunk-button flex items-center justify-center gap-2">
              COMEÇAR AGORA <ArrowRight className="w-5 h-5" />
            </a>
            <button className="cyberpunk-button-outline flex items-center justify-center gap-2">
              SAIBA MAIS
            </button>
          </div>

          {/* Network Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
            <div className="cyberpunk-card p-6">
              <div className="text-[#00ffff] text-2xl font-bold mb-2">Chain ID</div>
              <div className="text-white text-lg font-mono">5042002</div>
            </div>
            <div className="cyberpunk-card p-6">
              <div className="text-[#ff00ff] text-2xl font-bold mb-2">Moeda</div>
              <div className="text-white text-lg font-mono">USDC</div>
            </div>
            <div className="cyberpunk-card p-6">
              <div className="text-[#00ffff] text-2xl font-bold mb-2">RPC</div>
              <div className="text-white text-xs font-mono truncate">rpc.testnet.arc.network</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <h2 className="text-4xl font-black text-center mb-16 neon-pink">RECURSOS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="cyberpunk-card p-8 hover:shadow-[0_0_30px_rgba(255,0,255,0.4)] transition-all">
            <div className="w-12 h-12 bg-[#ff00ff] rounded-sm flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Links de Pagamento</h3>
            <p className="text-[#aaa]">Crie links compartilháveis para receber USDC com descrição e prazo personalizados.</p>
          </div>

          {/* Feature 2 */}
          <div className="cyberpunk-card p-8 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all">
            <div className="w-12 h-12 bg-[#00ffff] rounded-sm flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">QR Codes</h3>
            <p className="text-[#aaa]">Gere QR codes para cada pagamento e receba fundos com um simples scan.</p>
          </div>

          {/* Feature 3 */}
          <div className="cyberpunk-card p-8 hover:shadow-[0_0_30px_rgba(255,0,255,0.4)] transition-all">
            <div className="w-12 h-12 bg-[#ff00ff] rounded-sm flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Verificação On-Chain</h3>
            <p className="text-[#aaa]">Confirmação automática de transações na Arc Testnet com notificações em tempo real.</p>
          </div>

          {/* Feature 4 */}
          <div className="cyberpunk-card p-8 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all">
            <div className="w-12 h-12 bg-[#00ffff] rounded-sm flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Carteira Segura</h3>
            <p className="text-[#aaa]">Gerencie suas carteiras Arc Testnet com segurança e controle total.</p>
          </div>

          {/* Feature 5 */}
          <div className="cyberpunk-card p-8 hover:shadow-[0_0_30px_rgba(255,0,255,0.4)] transition-all">
            <div className="w-12 h-12 bg-[#ff00ff] rounded-sm flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Histórico Completo</h3>
            <p className="text-[#aaa]">Acompanhe todas as transações com status, filtros e comprovantes.</p>
          </div>

          {/* Feature 6 */}
          <div className="cyberpunk-card p-8 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all">
            <div className="w-12 h-12 bg-[#00ffff] rounded-sm flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Dashboard Admin</h3>
            <p className="text-[#aaa]">Painel administrativo para gerenciar usuários e transações da plataforma.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center border-t border-[#ff00ff]/30">
        <h2 className="text-3xl font-black mb-6 neon-cyan">PRONTO PARA COMEÇAR?</h2>
        <p className="text-[#aaa] mb-8 max-w-2xl mx-auto">
          Junte-se à revolução dos pagamentos descentralizados. Crie sua conta agora e comece a receber USDC.
        </p>
        <a href={getLoginUrl()} className="cyberpunk-button inline-flex items-center gap-2">
          CRIAR CONTA <ArrowRight className="w-5 h-5" />
        </a>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#ff00ff]/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-[#666]">
          <p>Arc Pay © 2026 | Pagamentos USDC na Arc Testnet</p>
        </div>
      </footer>
    </div>
  );
}
