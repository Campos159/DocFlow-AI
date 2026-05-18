function Sidebar({ activePage, setActivePage }) {
  const items = [
    "Dashboard",
    "Novo Documento",
    "Histórico",
    "Analytics",
    "Configurações"
  ]

  return (
    <div className="w-[260px] bg-zinc-950 border-r border-zinc-800 h-screen p-6 fixed left-0 top-0">

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          DocFlow
        </h1>

        <p className="text-zinc-500 text-sm mt-1">
          Automação com IA
        </p>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => setActivePage(item)}
            className={`w-full text-left p-4 rounded-xl transition ${
              activePage === item
                ? "bg-blue-600 text-white"
                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-sm text-zinc-400">
            Plano atual
          </p>

          <h2 className="text-xl font-bold mt-1">
            Premium
          </h2>
        </div>
      </div>

    </div>
  )
}

export default Sidebar