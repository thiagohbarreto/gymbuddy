import { Link, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import styles from "./Home.module.scss";
import { useEffect, useState } from "react";

const Home = () => {
  const [divisaoTreinos, setDivisaoTreinos] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchDivisaoTreinos = async () => {
    try {
      const response = await fetch(
        "http://localhost:3002/api/treinos/recentes"
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar a última divisão de treinos");
      }
      const treinos = await response.json();
      console.log("Última divisão de treinos recebida do backend:", treinos);

      const treinosFiltrados = treinos.filter(
        (t: any) => t.divisao && t.divisao.trim() !== ""
      );

      setDivisaoTreinos(treinosFiltrados);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDivisaoTreinos();
  }, []);

  const treinosPorDivisao: { [divisao: string]: any[] } = {};
  divisaoTreinos.forEach((treino) => {
    if (!treinosPorDivisao[treino.divisao]) {
      treinosPorDivisao[treino.divisao] = [];
    }
    treinosPorDivisao[treino.divisao].push(treino);
  });

  const handleDeleteTreino = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este treino?")) return;
    try {
      const response = await fetch(`http://localhost:3002/api/treinos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao deletar treino");

      fetchDivisaoTreinos();
    } catch (error) {
      alert("Erro ao deletar treino");
    }
  };

  return (
    <>
      <h1 className={styles.tituloCentralizado}>Treinos</h1>

      <div className={styles.recentWorkout}>
        {Object.keys(treinosPorDivisao).length > 0 ? (
          Object.entries(treinosPorDivisao).map(([divisao, treinos]) => (
            <div key={divisao} className={styles.divisaoCard}>
              <h2>
                Divisão <span className={styles.divisaoNome}>{divisao}</span>
              </h2>
              <div className={styles.treinosLista}>
                {treinos.map((treino) => (
                  <div key={treino.identificador} className={styles.treinoItem}>
                    <span className={styles.treinoLetra}>
                      Treino {treino.identificador}:
                    </span>
                    <div className={styles.treinoAcoes}>
                      <Link
                        className={styles.verTreino}
                        to={`/treino/${treino.divisao.toUpperCase()}/${treino.identificador.toUpperCase()}`}
                      >
                        Ver
                      </Link>
                      <button
                        className={styles.editarBtn}
                        onClick={() => navigate(`/editar-treino/${treino.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.deletarBtn}
                        onClick={() => handleDeleteTreino(treino.id)}
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma divisão de treinos encontrada.</p>
        )}
      </div>
      <div className={styles.createSection}>
        <button onClick={() => navigate("/nova-divisao")}>
          <PlusCircle size={20} />
          <span>Criar nova divisão</span>
        </button>
      </div>
    </>
  );
};

export default Home;
