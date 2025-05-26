import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ExercicioAttributes {
  id: number;
  nome: string;
  series: number;
  repeticoes: string;
  descanso: string;
  observacoes?: string;
  treino_id: number;
}

interface ExercicioCreationAttributes
  extends Optional<ExercicioAttributes, "id"> {}

class Exercicio
  extends Model<ExercicioAttributes, ExercicioCreationAttributes>
  implements ExercicioAttributes
{
  public id!: number;
  public nome!: string;
  public series!: number;
  public repeticoes!: string;
  public descanso!: string;
  public observacoes?: string;
  public treino_id!: number;
}

Exercicio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    series: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    repeticoes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descanso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observacoes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    treino_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Exercicio",
    timestamps: false,
  }
);

export default Exercicio;
