
CREATE DATABASE IF NOT EXISTS gym_buddy;

USE gym_buddy;


CREATE TABLE IF NOT EXISTS treinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    divisao VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS exercicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    treino_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    series INT NOT NULL,
    repeticoes VARCHAR(50) NOT NULL,
    descanso TIME NOT NULL,
    observacoes VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (treino_id) REFERENCES treinos(id) ON DELETE CASCADE
);

ALTER TABLE treinos
ADD COLUMN identificador VARCHAR(1) NOT NULL;


INSERT INTO treinos (titulo, divisao) VALUES ('Treino A', 'A');


INSERT INTO exercicios (treino_id, nome, series, repeticoes, descanso, observacoes)
VALUES (1, 'A', 3, '10-12', '00:01:00', 'Exercício de teste');

SELECT * FROM treinos WHERE divisao = 'A';


SELECT * FROM exercicios WHERE nome = 'A' AND treino_id = 35;

SELECT * FROM treinos WHERE id = 35;

INSERT INTO exercicios (treino_id, nome, series, repeticoes, descanso, observacoes)
VALUES (35, 'A', 3, '10-12', '00:01:00', 'Exercício de teste');

