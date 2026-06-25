const sections = [
  {
    title: "Predicciones",
    icon: "📝",
    items: [
      "En cada partido debes elegir qué equipo crees que ganará. No existe opción de empate.",
      "Además de los partidos, no olvides completar las predicciones extras: campeón, segundo lugar, tercer lugar, más goles, mayor goleada y más tarjetas rojas.",
      "Cada predicción tiene un tiempo límite. Cuando inicia el partido o la fase correspondiente, queda bloqueada automáticamente.",
    ],
  },
  {
    title: "Puntuación",
    icon: "⭐",
    items: [
      "Cada acierto suma puntos según la fase del torneo. Mientras más avanzada sea la fase, más puntos vale acertar.",
      "Las predicciones extras también suman puntos adicionales y pueden marcar la diferencia en el ranking final.",
      "Visita el ranking con frecuencia para ver tu posición, comparar puntajes y saber qué tan cerca estás de los primeros lugares.",
    ],
  },
  {
    title: "Premiación",
    icon: "🏆",
    items: [
      "La participación es gratuita.",
      "Existe un pozo de premios que será repartido entre los primeros lugares del ranking final.",
      "La distribución exacta del pozo será definida por los organizadores.",
    ],
  },
];

const points = [
  ["Eliminatoria de 32", "1 pt"],
  ["Octavos", "2 pts"],
  ["Cuartos", "4 pts"],
  ["Semifinal / 3er lugar", "6 pts"],
  ["Final", "10 pts"],
  ["Campeón", "8 pts"],
  ["Predicciones extras", "4 pts"],
];

export default function RulesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-4 py-2 text-sm font-semibold mb-4">
          🏆 Mundial 2026
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">
          Reglas de la Quiniela
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
          Predice, suma puntos, escala en el ranking y compite por el pozo final.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        {sections.map((section) => (
          <section
            key={section.title}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-sm"
          >
            <div className="text-4xl mb-4">{section.icon}</div>

            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>

            <ul className="space-y-3">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-2">
          📊 Tabla rápida de puntos
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-5 text-sm">
          Estos son los puntos que puedes ganar por cada acierto durante la quiniela.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {points.map(([stage, point]) => (
            <div
              key={stage}
              className="rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stage}
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 p-5 text-yellow-900 dark:text-yellow-100">
        <p className="font-bold">⏰ Importante</p>
        <p className="text-sm mt-1">
          No dejes tus predicciones para el último momento. Cuando se cumpla el
          tiempo límite, quedarán bloqueadas automáticamente.
        </p>
      </div>
    </div>
  );
}