import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Treino.module.scss";

const Treino = () => {
  const { divisao, letra } = useParams<{ divisao: string; letra: string }>();
  const [treino, setTreino] = useState<any>(null);
  const [tempoRestante, setTempoRestante] = useState<number | null>(null);

  useEffect(() => {
    console.log("Parâmetros recebidos:", divisao, letra);

    const fetchTreino = async (div, let_) => {
      try {
        const response = await fetch(
          `http://localhost:3002/api/treinos/${div}/${let_}`
        );
        if (response.status === 404) {
          setTreino("notfound");
          return;
        }
        if (!response.ok) {
          throw new Error("Erro ao buscar treino");
        }
        const treinoEncontrado = await response.json();
        console.log("Treino recebido do backend:", treinoEncontrado);
        if (Array.isArray(treinoEncontrado)) {
          setTreino(treinoEncontrado[0] || "notfound");
        } else {
          setTreino(treinoEncontrado);
        }
      } catch (error) {
        console.error(error);
        setTreino("notfound");
      }
    };

    if (divisao && letra) {
      console.log("Buscando treino para:", divisao, letra);
      fetchTreino(divisao, letra);
    } else {
      console.log("Parâmetros ausentes:", divisao, letra);
    }
  }, [divisao, letra]);

  const iniciarCronometro = (tempo: string) => {
    if (!tempo || !tempo.match(/^[0-5]?[0-9]:[0-5][0-9]$/)) {
      console.error("Formato de tempo inválido:", tempo);
      return;
    }

    const [minutos, segundos] = tempo.split(":").map(Number);
    const totalSegundos = minutos * 60 + segundos;

    if (isNaN(totalSegundos) || totalSegundos <= 0) {
      console.error("Tempo inválido:", tempo);
      return;
    }

    setTempoRestante(totalSegundos);

    const intervalo = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(intervalo);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatarTempo = (tempo: string) => {
    const partes = tempo.split(":");
    if (partes.length === 3) {
      return `${partes[1]}:${partes[2]}`;
    }
    return tempo;
  };

  if (treino === "notfound") {
    return <p>Nenhum treino encontrado para esta divisão e letra.</p>;
  }
  if (!treino) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Treino: {treino.titulo}</h1>
      <ul>
        {treino.exercicios.map((exercicio: any, index: number) => {
          console.log("Exercício:", exercicio);
          return (
            <li key={index}>
              <strong>{exercicio.nome}</strong> - {exercicio.series} séries,{" "}
              {exercicio.repeticoes} repetições,{" "}
              {formatarTempo(exercicio.descanso)} descanso.
              {exercicio.observacoes && (
                <p className={styles.observacoes}>
                  <strong>Observações:</strong> {exercicio.observacoes}
                </p>
              )}
              <div className={styles.timer}>
                <button
                  type="button"
                  onClick={() =>
                    iniciarCronometro(formatarTempo(exercicio.descanso))
                  }
                >
                  <span>Iniciar Cronômetro</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {tempoRestante !== null && (
        <div className={styles.container}>
          <h2>
            Tempo Restante: {Math.floor(tempoRestante / 60)}:
            {(tempoRestante % 60).toString().padStart(2, "0")}
          </h2>
        </div>
      )}
    </div>
  );
};

export default Treino;
