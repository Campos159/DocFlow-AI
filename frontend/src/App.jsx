import { useEffect, useState } from "react"
import api from "./services/api"
import Sidebar from "./components/Sidebar"

function App() {
  const [clientName, setClientName] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [description, setDescription] = useState("")
  const [processes, setProcesses] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState("")
  const [activePage, setActivePage] = useState("Dashboard")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const documentTemplates = [
    { title: "Contrato", value: "Contrato de Prestação de Serviços", description: "Formalização de prestação de serviços" },
    { title: "Declaração", value: "Declaração", description: "Confirmação oficial de informações" },
    { title: "Relatório", value: "Relatório Técnico", description: "Análises e avaliações técnicas" },
    { title: "Notificação", value: "Notificação Extrajudicial", description: "Comunicação formal" },
    { title: "Termo", value: "Termo de Ciência", description: "Registro de ciência e concordância" },
  ]

  async function loadProcesses() {
    const response = await api.get("/processes")
    setProcesses(response.data)
  }

  async function createProcess() {
    if (!clientName || !documentType) {
      setMessage("Preencha o nome do cliente e selecione um tipo de documento.")
      return
    }

    try {
      setIsGenerating(true)
      setMessage("")

      const formData = new FormData()
      formData.append("client_name", clientName)
      formData.append("document_type", documentType)
      formData.append("description", description)

      if (selectedFile) {
        formData.append("file", selectedFile)
      }

      await api.post("/processes", formData)

      setClientName("")
      setDocumentType("")
      setDescription("")
      setSelectedFile(null)
      setMessage("Documento gerado com sucesso!")

      await loadProcesses()
      setActivePage("Histórico")
    } catch (error) {
      setMessage("Erro ao gerar documento. Verifique o backend e tente novamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    loadProcesses()
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">DocFlow AI</h1>
            <p className="text-zinc-400 mt-2">
              Plataforma inteligente de automação documental
            </p>
          </div>

          <input
            type="email"
            placeholder="E-mail"
            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl outline-none mb-4"
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl outline-none mb-6"
          />

          <button
            onClick={() => setIsAuthenticated(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl font-semibold"
          >
            Entrar
          </button>

          <p className="text-zinc-500 text-sm mt-6 text-center">
            Ambiente demonstrativo
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="ml-[260px] w-full p-8">
        <div className="mb-10">
          <p className="text-blue-400 font-semibold mb-2">
            Plataforma de automação documental
          </p>

          <h1 className="text-5xl font-bold">DocFlow AI</h1>

          <p className="text-zinc-400 mt-3 max-w-2xl">
            Gere documentos inteligentes a partir de dados estruturados,
            com organização, velocidade e padronização.
          </p>
        </div>

        {activePage === "Dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400">Documentos recentes</p>
                <h2 className="text-4xl font-bold mt-2">{processes.length}</h2>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400">Modelo atual</p>
                <h2 className="text-2xl font-bold mt-2">DOCX + PDF</h2>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400">Status</p>
                <h2 className="text-2xl font-bold mt-2 text-green-400">Ativo</h2>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-4">Ações rápidas</h2>

              <p className="text-zinc-400 mb-6">
                Crie documentos, acompanhe o histórico e visualize automações recentes.
              </p>

              <button
                onClick={() => setActivePage("Novo Documento")}
                className="bg-blue-600 hover:bg-blue-700 transition px-6 py-4 rounded-xl font-semibold w-full mb-4"
              >
                Novo Documento
              </button>

              <button
                onClick={() => setActivePage("Histórico")}
                className="bg-zinc-800 hover:bg-zinc-700 transition px-6 py-4 rounded-xl font-semibold w-full"
              >
                Ver Histórico
              </button>

              <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <p className="text-sm text-zinc-500">Última automação</p>

                <h3 className="text-lg font-semibold mt-1">
                  {processes.length > 0 ? processes[0].document_type : "Nenhum documento"}
                </h3>
              </div>
            </div>
          </>
        )}

        {activePage === "Histórico" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h1 className="text-4xl font-bold mb-4">Histórico de documentos</h1>

            <p className="text-zinc-400 mb-8">
              Visualize e baixe todos os documentos gerados anteriormente.
            </p>

            <div className="space-y-4">
              {processes.map((process) => (
                <div
                  key={process.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h2 className="text-xl font-semibold">
                      {process.client_name}
                    </h2>

                    <p className="text-zinc-400 mt-1">
                      {process.document_type}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`http://127.0.0.1:8000/processes/${process.id}/download`}
                      target="_blank"
                      className="bg-green-600 hover:bg-green-700 transition px-5 py-3 rounded-xl font-semibold"
                    >
                      DOCX
                    </a>

                    <a
                      href={`http://127.0.0.1:8000/processes/${process.id}/download-pdf`}
                      target="_blank"
                      className="bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-xl font-semibold"
                    >
                      PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === "Novo Documento" && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">Criar novo documento</h2>

            <input
              className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl outline-none w-full mb-4"
              placeholder="Nome do cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />

            <div className="grid grid-cols-1 gap-3 mb-4">
              {documentTemplates.map((template) => (
                <button
                  key={template.value}
                  onClick={() => setDocumentType(template.value)}
                  className={`p-4 rounded-xl border text-left transition ${
                    documentType === template.value
                      ? "bg-blue-600/20 border-blue-500"
                      : "bg-zinc-800 border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  <h3 className="font-semibold text-lg">{template.title}</h3>

                  <p className="text-zinc-400 text-sm mt-1">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>

            <textarea
              className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl outline-none w-full h-36 mb-4"
              placeholder="Descreva as informações principais do documento"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="mb-4 block w-full text-sm text-zinc-400"
            />

            {selectedFile && (
              <p className="text-sm text-zinc-400 mb-4">
                Arquivo selecionado: {selectedFile.name}
              </p>
            )}

            {message && (
              <div className="bg-zinc-800 border border-zinc-700 text-zinc-300 p-4 rounded-xl mb-4">
                {message}
              </div>
            )}

            <button
              onClick={createProcess}
              disabled={isGenerating}
              className={`transition px-6 py-4 rounded-xl font-semibold w-full ${
                isGenerating
                  ? "bg-zinc-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isGenerating ? "Gerando documento..." : "Gerar Documento"}
            </button>
          </div>
        )}

        {activePage === "Analytics" && (
          <div className="space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <h1 className="text-4xl font-bold mb-4">Analytics</h1>

              <p className="text-zinc-400">
                Acompanhe a produtividade documental e os modelos mais utilizados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400">Total gerado</p>
                <h2 className="text-4xl font-bold mt-2">{processes.length}</h2>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400">Formato principal</p>
                <h2 className="text-3xl font-bold mt-2">DOCX/PDF</h2>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400">Automação</p>
                <h2 className="text-3xl font-bold mt-2 text-green-400">
                  Ativa
                </h2>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Documentos por modelo
              </h2>

              <div className="space-y-4">
                {documentTemplates.map((template) => {
                  const total = processes.filter(
                    (process) => process.document_type === template.value
                  ).length

                  const percentage =
                    processes.length > 0 ? (total / processes.length) * 100 : 0

                  return (
                    <div key={template.value}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-zinc-300">{template.title}</p>
                        <p className="text-zinc-400">{total}</p>
                      </div>

                      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activePage !== "Dashboard" &&
          activePage !== "Histórico" &&
          activePage !== "Novo Documento" &&
          activePage !== "Analytics" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <h1 className="text-4xl font-bold mb-4">{activePage}</h1>

              <p className="text-zinc-400">
                Esta seção está preparada para evolução futura do sistema.
              </p>
            </div>
          )}
      </div>
    </div>
  )
}

export default App