import { Sequelize } from "sequelize";

const sequelize = new Sequelize("gym_buddy", "root", "senha123@", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
