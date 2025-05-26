import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Exercicio from "./Exercicio";

interface TreinoAttributes {
  id: number;
  titulo: string;
  divisao: string;
  identificador: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TreinoCreationAttributes
  extends Optional<TreinoAttributes, "id" | "createdAt" | "updatedAt"> {}

class Treino
  extends Model<TreinoAttributes, TreinoCreationAttributes>
  implements TreinoAttributes
{
  public id!: number;
  public titulo!: string;
  public divisao!: string;
  public identificador!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public exercicios?: Exercicio[];
}

Treino.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    divisao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    identificador: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Treino",
    timestamps: true,
  }
);

Treino.hasMany(Exercicio, { as: "exercicios", foreignKey: "treino_id" });
Exercicio.belongsTo(Treino, { as: "treino", foreignKey: "treino_id" });

export default Treino;
