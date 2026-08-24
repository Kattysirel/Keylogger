import { useCallback, useEffect, useMemo, useState } from 'react'

const API_URL = 'http://127.0.0.1:8000/log/'
const POLL_MS = 2000

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

interface LogResponse {
  content: string
  exists: boolean
}

function App() {
  const [content, setContent] = useState('')
  const [exists, setExists] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(API_URL)
      const data: LogResponse = await res.json()
      setContent(data.content)
      setExists(data.exists)
      setError(null)
      setLastUpdate(new Date())
    } catch {
      setError('No se pudo conectar con el visor. ¿Está corriendo viewer_server.py en http://127.0.0.1:8000?')
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!autoRefresh) return
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [autoRefresh, refresh])

  const letters = useMemo(
    () =>
      content
        .split('\n')
        .map((l) => l.trim().toLowerCase())
        .filter((l) => l.length === 1 && /[a-z]/.test(l)),
    [content],
  )

  const frequency = useMemo(() => {
    const counts = Object.fromEntries(ALPHABET.map((l) => [l, 0])) as Record<string, number>
    for (const l of letters) counts[l]++
    return counts
  }, [letters])

  const maxFreq = Math.max(1, ...Object.values(frequency))

  return (
    <div className="min-h-screen bg-[#0a0f0c] px-6 py-12 font-mono text-emerald-100">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Keylogger<span className="text-emerald-400">.viewer</span>
          </h1>
          <p className="mt-2 text-sm text-emerald-100/50">
            Visor de solo lectura de <code className="text-emerald-300">log.txt</code>. No inicia, detiene ni
            controla la captura real — eso lo hace <code className="text-emerald-300">main.py</code> por su cuenta.
          </p>
        </header>

        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
          Uso educativo. Corre esto solo sobre tu propio equipo, nunca en un dispositivo ajeno o sin permiso
          explícito de su dueño.
        </div>

        <div className="mb-6 flex items-center justify-between rounded-lg border border-emerald-900 bg-black/40 px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${error ? 'bg-rose-500' : 'bg-emerald-400'}`} />
            <span className="text-emerald-100/60">
              {error ? 'Desconectado' : lastUpdate ? `Actualizado ${lastUpdate.toLocaleTimeString()}` : 'Conectando…'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-emerald-100/60">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="accent-emerald-500"
              />
              auto
            </label>
            <button onClick={refresh} className="text-emerald-400 hover:text-emerald-300">
              actualizar
            </button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}

        {exists === false && !error && (
          <div className="rounded-lg border border-emerald-900 bg-black/40 px-4 py-6 text-center text-sm text-emerald-100/50">
            Todavía no existe <code className="text-emerald-300">log.txt</code>. Corre{' '}
            <code className="text-emerald-300">python main.py</code> y escribe algo para empezar a capturar.
          </div>
        )}

        {exists && (
          <>
            <div className="mb-6 rounded-2xl border border-emerald-900 bg-black/40 p-5">
              <p className="mb-2 text-xs uppercase tracking-wide text-emerald-100/40">
                Texto capturado ({letters.length} letras)
              </p>
              <div className="max-h-40 overflow-y-auto rounded-lg bg-black/60 p-3 text-sm leading-relaxed break-all text-emerald-300">
                {letters.length > 0 ? letters.join('') : <span className="text-emerald-100/30">(vacío)</span>}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-900 bg-black/40 p-5">
              <p className="mb-3 text-xs uppercase tracking-wide text-emerald-100/40">Frecuencia por letra</p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {ALPHABET.filter((l) => frequency[l] > 0)
                  .sort((a, b) => frequency[b] - frequency[a])
                  .map((l) => (
                    <div key={l} className="flex items-center gap-2 text-xs">
                      <span className="w-4 uppercase text-emerald-100/60">{l}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-emerald-950">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${(frequency[l] / maxFreq) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-emerald-100/60">{frequency[l]}</span>
                    </div>
                  ))}
                {letters.length === 0 && <p className="text-xs text-emerald-100/30">Sin datos todavía.</p>}
              </div>
            </div>
          </>
        )}

        <footer className="mt-10 text-center text-xs text-emerald-100/30">
          Script original en <code className="text-emerald-100/50">../main.py</code> · servidor visor en{' '}
          <code className="text-emerald-100/50">../viewer_server.py</code>.
        </footer>
      </div>
    </div>
  )
}

export default App
