import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditarTreino.module.scss";

const EditarTreino = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [treino, setTreino] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3002/api/treinos/${id}`)
      .then((res) => res.json())
      .then(setTreino)
      .catch(() => alert("Erro ao carregar treino"));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTreino({ ...treino, [e.target.name]: e.target.value });
  };

  const handleExercicioChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    console.log("Editando exercício", idx, name, value);
    setTreino((prev: any) => {
      const novosExercicios = prev.exercicios.map((ex: any, i: number) =>
        i === idx
          ? {
              ...ex,
              [name]: type === "number" ? Number(value) : value,
            }
          : ex
      );
      return { ...prev, exercicios: novosExercicios };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3002/api/treinos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(treino),
      });
      if (!response.ok) throw new Error("Erro ao editar treino");
      alert("Treino editado com sucesso!");
      navigate("/");
    } catch {
      alert("Erro ao editar treino");
    }
  };

  if (!treino) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h2>Editar Treino</h2>
        <label>
          Título:
          <input
            name="titulo"
            value={treino.titulo || ""}
            onChange={handleChange}
          />
        </label>

        <h3>Exercícios</h3>
        {treino.exercicios?.map((ex: any, idx: number) => (
          <div key={ex.id} className={styles.exercicioCard}>
            <label>
              Nome:
              <input
                name="nome"
                value={ex.nome || ""}
                onChange={(e) => handleExercicioChange(idx, e)}
              />
            </label>
            <label>
              Séries:
              <input
                name="series"
                type="number"
                value={ex.series !== undefined ? String(ex.series) : ""}
                onChange={(e) => handleExercicioChange(idx, e)}
              />
            </label>
            <label>
              Repetições:
              <input
                name="repeticoes"
                value={ex.repeticoes || ""}
                onChange={(e) => handleExercicioChange(idx, e)}
              />
            </label>
            <label>
              Descanso:
              <input
                name="descanso"
                value={ex.descanso || ""}
                onChange={(e) => handleExercicioChange(idx, e)}
              />
            </label>
            <label>
              Observações:
              <input
                name="observacoes"
                value={ex.observacoes || ""}
                onChange={(e) => handleExercicioChange(idx, e)}
              />
            </label>
          </div>
        ))}

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditarTreino;
