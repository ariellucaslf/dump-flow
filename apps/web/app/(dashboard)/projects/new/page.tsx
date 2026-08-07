"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../../../actions/project.actions";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import cronstrue from "cronstrue/i18n";

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [destType, setDestType] = useState("AWS_S3");
  const [cronType, setCronType] = useState("0 3 * * *");
  const [customCron, setCustomCron] = useState("0 3 * * *");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createProject(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/projects" className="p-2 hover:bg-neutral-800 rounded-full transition-colors border border-neutral-800">
          <ArrowLeft className="w-5 h-5 text-neutral-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Novo Projeto</h1>
          <p className="text-sm text-neutral-400">Configure um banco de dados e defina onde salvar os backups.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-medium text-white mb-4">Informações do Banco (PostgreSQL)</h2>
          
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Nome do Projeto</label>
            <input 
              name="name" 
              required 
              type="text" 
              placeholder="Ex: App de Produção SaaS"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">URL de Conexão (PostgreSQL)</label>
            <input 
              name="dbUrl" 
              required 
              type="url" 
              placeholder="postgresql://user:pass@host:5432/db"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Agendamento de Backup</label>
            <select 
              value={cronType}
              onChange={(e) => {
                setCronType(e.target.value);
                if (e.target.value !== 'CUSTOM') {
                  setCustomCron(e.target.value);
                }
              }}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none mb-3"
            >
              <option value="0 * * * *">A cada 1 hora</option>
              <option value="0 */6 * * *">A cada 6 horas</option>
              <option value="0 0 * * *">Diariamente (Meia-noite)</option>
              <option value="0 3 * * *">Diariamente (Madrugada - 03:00)</option>
              <option value="0 0 * * 0">Semanalmente (Domingo)</option>
              <option value="CUSTOM">Personalizado (Avançado)</option>
            </select>
            
            <input type="hidden" name="cronSchedule" value={cronType === 'CUSTOM' ? customCron : cronType} />

            {cronType === 'CUSTOM' && (
              <div className="mt-3 bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
                <input 
                  type="text" 
                  value={customCron}
                  onChange={(e) => setCustomCron(e.target.value)}
                  placeholder="Ex: 0 3 * * *"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
                />
                <p className={`mt-3 text-sm font-medium ${
                  (() => {
                    try {
                      cronstrue.toString(customCron);
                      return "text-emerald-400";
                    } catch {
                      return "text-red-400";
                    }
                  })()
                }`}>
                  {(() => {
                    try {
                      let translated = cronstrue.toString(customCron, { locale: 'pt_BR', use24HourTimeFormat: true, verbose: true });
                      // Ajuste manual: cronstrue as vezes omite "Todo dia" para agendamentos diários
                      if (translated.startsWith('Às') || translated.startsWith('As')) {
                        translated = 'Todo dia ' + translated.toLowerCase();
                      }
                      // Capitalizar primeira letra
                      translated = translated.charAt(0).toUpperCase() + translated.slice(1);
                      return "👉 " + translated;
                    } catch {
                      return "⚠️ Expressão Cron inválida ou incompleta";
                    }
                  })()}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-medium text-white mb-4">Destino de Armazenamento</h2>
          
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Provedor Nuvem</label>
            <select 
              name="destinationType"
              value={destType}
              onChange={(e) => setDestType(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="AWS_S3">Amazon S3 (AWS)</option>
              <option value="GOOGLE_DRIVE">Google Drive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              {destType === 'AWS_S3' ? 'Nome do Bucket (S3)' : 'ID da Pasta Compartilhada (Drive)'}
            </label>
            <input 
              name="destinationTarget" 
              required 
              type="text" 
              placeholder={destType === 'AWS_S3' ? "meu-bucket-seguro" : "1A2B3C4D5E6F7G8H9I"}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Credenciais de Autenticação (JSON)</label>
            <p className="text-xs text-neutral-500 mb-2">
              {destType === 'AWS_S3' 
                ? 'Cole as chaves da AWS no formato JSON: {"accessKeyId": "...", "secretAccessKey": "...", "region": "us-east-1"}' 
                : 'Cole o conteúdo inteiro do arquivo JSON da Service Account do Google Cloud.'}
            </p>
            <textarea 
              name="destinationCredentials" 
              required 
              rows={5}
              placeholder='{"tipo": "sua-chave..."}'
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              Salvar Configuração e Ativar
            </>
          )}
        </button>
      </form>
    </div>
  );
}
