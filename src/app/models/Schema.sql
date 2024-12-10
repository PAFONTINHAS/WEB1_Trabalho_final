DROP DATABASE IF EXISTS task_management;
CREATE DATABASE IF NOT EXISTS task_management;
USE task_management;

CREATE TABLE IF NOT EXISTS Permissao(
	codPermissao INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    nivelAcesso INT NULL
);

CREATE TABLE IF NOT EXISTS Funcionario(
	codFunc INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nomeFunc VARCHAR(200),
    emailFunc VARCHAR(200),
    cargo VARCHAR(200),
    codPermissao INT NOT NULL,
    ativo BOOLEAN NOT NULL,
    FOREIGN KEY (codPermissao) REFERENCES Permissao(codPermissao)
);
CREATE TABLE IF NOT EXISTS Equipe(
	codEquipe INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    descricao TEXT,
    nomeEquipe VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS Membros(
    codFunc INT NOT NULL,
    codEquipe INT NOT NULL,
    PRIMARY KEY (codFunc, codEquipe),
    FOREIGN KEY (codEquipe) REFERENCES Equipe(codEquipe),
	FOREIGN KEY (codFunc) REFERENCES Funcionario(codFunc)
);

CREATE TABLE IF NOT EXISTS Tarefa(
	codTarefa INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    dataCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dataInicio DATE NOT NULL,
    dataLimite DATE NOT NULL,
    statusTarefa ENUM('pendente', 'em-andamento', 'esperando-aprovacao', 'concluida'),
    codCriador INT NOT NULL,
    codEquipe INT NOT NULL,
	FOREIGN KEY (codEquipe) REFERENCES Equipe(codEquipe),
	FOREIGN KEY (codCriador) REFERENCES Funcionario(codFunc)

);

CREATE TABLE IF NOT EXISTS Membros_tarefas (
  codFunc INT,
  codTarefa INT,
  PRIMARY KEY (codFunc, codTarefa),
  FOREIGN KEY (codFunc) REFERENCES funcionario(codFunc),
  FOREIGN KEY (codTarefa) REFERENCES tarefa(codTarefa)
);


--  NÃO PRECISA COPIAR OS SELECTS, ELES FORAM FEITOS PARA TESTES

-- SELECIONAR TODOS AS TAREFAS AGRUPADAS POR FUNCIONARIO
SELECT f.nomeFunc AS funcionario, COUNT(codTarefa) AS tarefas
    FROM membros_tarefas MT
    INNER JOIN funcionario f
    ON f.codFunc = mt.codFunc GROUP BY f.nomeFunc;


-- SELECIONAR TODOS OS FUNCIONÁRIOS SEM TAREFAS
SELECT COUNT(*) AS "sem_tarefas"
    FROM Funcionario F
    LEFT JOIN Membros_Tarefas MT ON F.codFunc = MT.codFunc
    WHERE MT.codFunc IS NULL;


-- SELECIONAR AS ÚLTIMAS 5 TAREFAS CADASTRADAS NO BANCO
SELECT t.titulo, t.dataInicio, t.dataLimite, t.statusTarefa, f.nomeFunc, e.nomeEquipe
FROM tarefa t
INNER JOIN Funcionario f ON f.codFunc = t.codCriador
INNER JOIN Equipe e ON e.codEquipe = t.codEquipe
ORDER BY t.dataCriacao DESC Limit 5;

-- SELECIONAR AS TAREFAS ORDENADAS POR STATUS
SELECT t.titulo, t.dataInicio, t.dataLimite, t.statusTarefa, f.nomeFunc, e.nomeEquipe
FROM tarefa t
INNER JOIN Funcionario f ON f.codFunc = t.codCriador
INNER JOIN Equipe e ON e.codEquipe = t.codEquipe
ORDER BY t.statusTarefa;


SELECT tarefa.titulo, funcionario.nomeFunc, equipe.nomeEquipe
FROM tarefa
INNER JOIN funcionario ON funcionario.codFunc = tarefa.codCriador
INNER JOIN equipe ON equipe.codEquipe = tarefa.codEquipe
WHERE tarefa.codTarefa = 1;


SELECT
    funcionario.nomeFunc AS Membro,
    equipe.nomeEquipe AS Equipe
FROM membros
INNER JOIN funcionario ON membros.codFunc = funcionario.codFunc
INNER JOIN equipe ON membros.codEquipe = equipe.codEquipe
ORDER BY Membro AND Equipe;


