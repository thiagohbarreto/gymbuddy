import express, { Request, Response } from "express";
import { Op, fn, col, where } from "sequelize";
import Treino from "../models/Treino";
import Exercicio from "../models/Exercicio";
import sequelize from "../config/database";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    console.log("Corpo da requisição recebido:", req.body);

    const { titulo, divisao, identificador, exercicios } = req.body;

    if (!titulo?.trim() || !divisao?.trim()) {
      console.error("Erro: Campos obrigatórios ausentes ou vazios.", {
        titulo,
        divisao,
      });
      return res.status(400).json({
        error:
          "Os campos 'titulo' e 'divisao' são obrigatórios e não podem estar vazios.",
      });
    }

    console.log("Dados recebidos no backend:", {
      titulo,
      divisao,
      identificador,
      exercicios,
    });

    if (exercicios && Array.isArray(exercicios)) {
      const exerciciosInvalidos = exercicios.some(
        (exercicio: any) => !exercicio.nome?.trim()
      );

      if (exerciciosInvalidos) {
        console.error(
          "Erro: Exercícios com campos obrigatórios ausentes ou vazios.",
          {
            exercicios,
          }
        );
        return res.status(400).json({
          error: "Todos os exercícios devem ter um nome válido.",
        });
      }
    }

    const novoTreino = await Treino.create({
      titulo: titulo.trim(),
      divisao: divisao.trim(),
      identificador: identificador?.trim(),
    });

    console.log("Treino criado com sucesso:", novoTreino);

    if (exercicios && Array.isArray(exercicios)) {
      const exerciciosCriados = await Promise.all(
        exercicios.map((exercicio: any) =>
          Exercicio.create({
            ...exercicio,
            treino_id: novoTreino.id,
          })
        )
      );

      console.log("Exercícios criados com sucesso:", exerciciosCriados);
    }

    res.status(201).json(novoTreino);
  } catch (error) {
    console.error("Erro ao criar treino:", error);
    res.status(500).json({ error: "Erro ao criar treino", detalhes: error });
  }
});

router.get("/treinos", async (_req: Request, res: Response) => {
  try {
    const treinos = await Treino.findAll({
      include: [{ model: Exercicio, as: "exercicios" }],
    });

    res.json(treinos);
  } catch (error) {
    console.error("Erro ao buscar treinos:", error);
    res.status(500).json({ error: "Erro ao buscar treinos" });
  }
});

router.get("/recentes", async (_req: Request, res: Response): Promise<void> => {
  try {
    const treinosRecentes = await Treino.findAll({
      attributes: ["divisao", "identificador"],
      group: ["divisao", "identificador"],
      raw: true,
    });

    const treinosCompletos = await Promise.all(
      treinosRecentes.map(async (treino: any) => {
        return await Treino.findOne({
          where: {
            divisao: treino.divisao,
            identificador: treino.identificador,
          },
          order: [["createdAt", "DESC"]],
          include: [{ model: Exercicio, as: "exercicios" }],
        });
      })
    );

    const treinosValidos = treinosCompletos.filter((treino) => treino !== null);

    res.json(treinosValidos);
  } catch (error) {
    console.error("Erro ao buscar a última divisão de treinos:", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar a última divisão de treinos" });
  }
});

router.get("/anteriores", async (_req: Request, res: Response) => {
  try {
    const treinosAnteriores = await Treino.findAll({
      order: [["createdAt", "DESC"]],
      offset: 1,
      include: [{ model: Exercicio, as: "exercicios" }],
    });

    const treinosFormatados = treinosAnteriores.map((treino) => ({
      ...treino.toJSON(),
      exercicios: treino.exercicios?.map((ex: any) => ({
        id: ex.id,
        nome: ex.nome,
        series: ex.series,
        repeticoes: ex.repeticoes,
        descanso:
          ex.descanso.split(":").length === 3
            ? `${ex.descanso.split(":")[1]}:${ex.descanso.split(":")[2]}`
            : ex.descanso,
        observacoes: ex.observacoes || "",
      })),
    }));

    res.json(treinosFormatados);
  } catch (error) {
    console.error("Erro ao buscar treinos anteriores:", error);
    res.status(500).json({ error: "Erro ao buscar treinos anteriores" });
  }
});

router.get("/", async (req, res) => {
  try {
    const treinos = await Treino.findAll({
      include: [
        {
          model: Exercicio,
          as: "exercicios",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(treinos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar treinos" });
  }
});

router.get("/:divisao/:letra", async (req, res) => {
  try {
    const { divisao, letra } = req.params;
    const treino = await Treino.findOne({
      where: {
        [Op.and]: [
          where(fn("upper", col("divisao")), divisao.toUpperCase()),
          where(fn("upper", col("identificador")), letra.toUpperCase()),
        ],
      },
      order: [["createdAt", "DESC"]],
      include: [{ model: Exercicio, as: "exercicios" }],
    });

    if (!treino) {
      return res.status(404).json({
        message: "Nenhum treino encontrado para esta divisão e letra.",
      });
    }

    res.json(treino);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar treino" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, divisao, identificador, exercicios } = req.body;
    const treino = await Treino.findByPk(id, {
      include: [{ model: Exercicio, as: "exercicios" }],
    });
    if (!treino)
      return res.status(404).json({ error: "Treino não encontrado" });

    await treino.update({ titulo, divisao, identificador });

    if (exercicios && Array.isArray(exercicios)) {
      for (const ex of exercicios) {
        if (ex.id) {
          await Exercicio.update(
            {
              nome: ex.nome,
              series: ex.series,
              repeticoes: ex.repeticoes,
              descanso: ex.descanso,
              observacoes: ex.observacoes,
            },
            { where: { id: ex.id, treino_id: treino.id } }
          );
        }
      }
    }

    const treinoAtualizado = await Treino.findByPk(id, {
      include: [{ model: Exercicio, as: "exercicios" }],
    });

    res.json(treinoAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar treino" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const treino = await Treino.findByPk(id);
    if (!treino)
      return res.status(404).json({ error: "Treino não encontrado" });

    await treino.destroy();
    res.json({ message: "Treino deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar treino" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const treino = await Treino.findByPk(id, {
      include: [{ model: Exercicio, as: "exercicios" }],
    });
    if (!treino) {
      return res.status(404).json({ error: "Treino não encontrado" });
    }
    res.json(treino);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar treino por ID" });
  }
});

export default router;
