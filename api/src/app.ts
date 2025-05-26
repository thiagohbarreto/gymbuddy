import express, { Request, Response } from "express";
import cors from "cors";
import treinosRouter from "./routes/treinos";

import sequelize from "./config/database";
import Treino from "./models/Treino";
import Exercicio from "./models/Exercicio";

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Banco de dados sincronizado!");
  })
  .catch((error) => {
    console.error("Erro ao sincronizar o banco de dados:", error);
  });

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use("/api/treinos", treinosRouter);
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.get("/api/treinos/recentes", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT t.*
      FROM "Treinos" t
      INNER JOIN (
        SELECT "divisao", "identificador", MAX("createdAt") as max_created
        FROM "Treinos"
        WHERE "divisao" IS NOT NULL AND "divisao" != ''
          AND "identificador" IS NOT NULL AND "identificador" != ''
        GROUP BY "divisao", "identificador"
      ) latest
      ON t."divisao" = latest."divisao"
         AND t."identificador" = latest."identificador"
         AND t."createdAt" = latest.max_created
      WHERE t."divisao" IS NOT NULL AND t."divisao" != ''
        AND t."identificador" IS NOT NULL AND t."identificador" != ''
      ORDER BY t."divisao", t."identificador"
    `);

    res.json(results);
  } catch (error) {
    console.error("Erro ao buscar treinos recentes:", error);
    res.status(500).json({ error: "Erro ao buscar treinos recentes" });
  }
});

app.get(
  "/api/treinos/:divisao/:letra",
  async (req: express.Request, res: express.Response) => {
    try {
      const { divisao, letra } = req.params;

      console.log("Divisão recebida:", divisao);
      console.log("Letra recebida:", letra);

      const treinoMaisRecente = await Treino.findOne({
        where: { divisao, identificador: letra },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Exercicio,
            as: "exercicios",
          },
        ],
      });

      console.log(
        "Resultado da consulta:",
        JSON.stringify(treinoMaisRecente, null, 2)
      );

      if (!treinoMaisRecente) {
        return res.status(404).json({
          message: "Nenhum treino encontrado para esta divisão e letra.",
        });
      }

      res.json(treinoMaisRecente);
    } catch (error) {
      console.error("Erro ao buscar o treino por divisão e letra:", error);
      res
        .status(500)
        .json({ message: "Erro ao buscar o treino por divisão e letra." });
    }
  }
);

export default app;
