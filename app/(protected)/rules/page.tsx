const rules = [
  {
    title: "Predicciones",
    icon: "📝",
    description:
      "Cada participante debe elegir una opción por partido: gana el equipo local, empate o gana el equipo visitante. Las predicciones se pueden modificar hasta antes del inicio del partido. Una vez iniciado, el pronóstico queda bloqueado.",
  },
  {
    title: "Puntuación",
    icon: "⭐",
    description:
      "Cada acierto suma puntos según la fase del torneo. Si el resultado oficial coincide con tu predicción, recibirás los puntos correspondientes. Los partidos de fases finales pueden valer más para permitir remontadas.",
  },
  {
    title: "Premiación",
    icon: "🏆",
    description:
      "El pozo acumulado se repartirá entre los primeros lugares del ranking final. La distribución exacta de premios será definida por la organización antes del inicio del torneo.",
  },
];

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Reglas de la Quiniela</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Conoce cómo participar, sumar puntos y ganar premios.
        </p>
      </div>

      <div className="grid gap-6">
        {rules.map((rule) => (
          <section
            key={rule.title}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{rule.icon}</div>

              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {rule.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}