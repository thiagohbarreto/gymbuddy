import { useNavigate } from "react-router-dom";
import styles from "./NovaDivisao.module.scss";

const opcoesDivisao = ["A", "AB", "ABC", "ABCD", "ABCDE", "ABCDEF"];

const NovaDivisao = () => {
  const navigate = useNavigate();

  const selecionarDivisao = (divisao: string) => {
    navigate(`/criar-treino?divisao=${divisao}`);
  };

  return (
    <div className={styles.novaDivisao}>
      <h1>Qual a divisão do seu treino?</h1>
      <ul>
        {opcoesDivisao.map((divisao) => (
          <li key={divisao}>
            <button onClick={() => selecionarDivisao(divisao)}>
              {divisao}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NovaDivisao;
