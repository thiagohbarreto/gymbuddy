import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./CriarTreino.module.scss";

const CriarTreino = () => {
  const [searchParams] = useSearchParams();
  const divisao = searchParams.get("divisao") || "A";
  const letras = divisao.split("");

  const [treinos, setTreinos] = useState(
    letras.map((letra) => ({
      titulo: "",
      identificador: letra,
      exercicios: [
        {
          nome: "",
          series: "0",
          repeticoes: "",
          descanso: "00:00",
          observacoes: "",
        },
      ],
    }))
  );

  const atualizarTitulo = (index: number, novoTitulo: string) => {
    const novos = [...treinos];
    novos[index].titulo = novoTitulo;
    setTreinos(novos);
  };

  const atualizarIdentificador = (index: number, novoIdentificador: string) => {
    const novos = [...treinos];
    novos[index].identificador = novoIdentificador;
    setTreinos(novos);
  };

  const adicionarExercicio = (treinoIndex: number) => {
    const novos = [...treinos];
    novos[treinoIndex].exercicios.push({
      nome: "",
      series: "",
      repeticoes: "",
      descanso: "",
      observacoes: "",
    });
    setTreinos(novos);
  };

  const atualizarExercicio = (
    treinoIndex: number,
    exercicioIndex: number,
    campo: string,
    valor: string
  ) => {
    const novos = [...treinos];
    novos[treinoIndex].exercicios[exercicioIndex][
      campo as keyof (typeof novos)[0]["exercicios"][0]
    ] = valor;
    setTreinos(novos);
  };

  const removerExercicio = (treinoIndex: number, exercicioIndex: number) => {
    const novos = [...treinos];
    novos[treinoIndex].exercicios.splice(exercicioIndex, 1);
    setTreinos(novos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const treino of treinos) {
      const treinoFormatado = {
        titulo: treino.titulo.trim(),
        divisao: divisao.trim(),
        identificador: treino.identificador.trim(),
        exercicios: treino.exercicios.map((ex) => ({
          nome: ex.nome.trim(),
          series: parseInt(ex.series, 10) || 0,
          repeticoes: ex.repeticoes.trim(),
          descanso: ex.descanso.trim() || "00:00",
          observacoes: ex.observacoes.trim() || "",
        })),
      };

      console.log("Enviando treino ao backend:", treinoFormatado);

      try {
        const response = await fetch("http://localhost:3002/api/treinos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(treinoFormatado),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro do backend:", errorData);
          throw new Error("Erro ao salvar treino");
        }
      } catch (error) {
        console.error("Erro ao salvar treino:", error);
        alert("Erro ao salvar treino.");
        return;
      }
    }

    alert("Treinos salvos com sucesso!");
  };

  return (
    <div className={styles.container}>
      <h1>Criar Treinos - Divisão {divisao}</h1>
      <form onSubmit={handleSubmit}>
        {letras.map((letra, i) => (
          <div key={i} className={styles.treinoCard}>
            <h2>Treino {letra}</h2>
            <label>
              Título:
              <input
                type="text"
                value={treinos[i].titulo}
                onChange={(e) => atualizarTitulo(i, e.target.value)}
                required
              />
            </label>
            <label>
              Identificador: <span>{treinos[i].identificador}</span>
            </label>

            {treinos[i].exercicios.map((ex, j) => (
              <div key={j} className={styles.exercicio}>
                <input
                  type="text"
                  placeholder="Nome do Exercício"
                  value={ex.nome}
                  onChange={(e) =>
                    atualizarExercicio(i, j, "nome", e.target.value)
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Séries"
                  value={ex.series}
                  onChange={(e) =>
                    atualizarExercicio(i, j, "series", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Repetições"
                  value={ex.repeticoes}
                  onChange={(e) =>
                    atualizarExercicio(i, j, "repeticoes", e.target.value)
                  }
                  required
                />
                <div className={styles.tempoDescanso}>
                  <input
                    type="number"
                    placeholder="Minutos"
                    min="0"
                    max="59"
                    value={ex.descanso.split(":")[0]}
                    onFocus={(e) => {
                      if (e.target.value === "00") e.target.value = "";
                    }}
                    onBlur={(e) => {
                      const minutos = e.target.value || "0";
                      const segundos = ex.descanso.split(":")[1] || "00";
                      atualizarExercicio(
                        i,
                        j,
                        "descanso",
                        `${minutos.padStart(2, "0")}:${segundos}`
                      );
                    }}
                    onChange={(e) => {
                      const segundos = ex.descanso.split(":")[1] || "00";
                      atualizarExercicio(
                        i,
                        j,
                        "descanso",
                        `${e.target.value}:${segundos}`
                      );
                    }}
                    required
                  />
                  <span>:</span>
                  <input
                    type="number"
                    placeholder="Segundos"
                    min="0"
                    max="59"
                    value={ex.descanso.split(":")[1]}
                    onFocus={(e) => {
                      if (e.target.value === "00") e.target.value = "";
                    }}
                    onBlur={(e) => {
                      const minutos = ex.descanso.split(":")[0] || "00";
                      const segundos = e.target.value || "0";
                      atualizarExercicio(
                        i,
                        j,
                        "descanso",
                        `${minutos}:${segundos.padStart(2, "0")}`
                      );
                    }}
                    onChange={(e) => {
                      const minutos = ex.descanso.split(":")[0] || "00";
                      atualizarExercicio(
                        i,
                        j,
                        "descanso",
                        `${minutos}:${e.target.value}`
                      );
                    }}
                    required
                  />
                </div>

                <textarea
                  placeholder="Observações"
                  value={ex.observacoes || ""}
                  onChange={(e) =>
                    atualizarExercicio(i, j, "observacoes", e.target.value)
                  }
                  className={styles.observacoes}
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removerExercicio(i, j)}
                >
                  Remover
                </button>
              </div>
            ))}

            <button type="button" onClick={() => adicionarExercicio(i)}>
              Adicionar Exercício
            </button>
          </div>
        ))}

        <button type="submit" className={styles.salvar}>
          Salvar Treino
        </button>
      </form>
    </div>
  );
};

export default CriarTreino;
