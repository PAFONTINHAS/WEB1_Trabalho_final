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
    FOREIGN KEY (codPermissao) REFERENCES Permissao(codPermissao)
);
CREATE TABLE IF NOT EXISTS Equipe(
	codEquipe INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
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
