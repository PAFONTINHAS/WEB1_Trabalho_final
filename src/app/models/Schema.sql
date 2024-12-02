DROP DATABASE IF EXISTS task_management;
CREATE DATABASE task_management;
USE task_management;

USE task_management;

CREATE TABLE Permissao(
	codPermissao INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    nivelAcesso INT NULL
);

CREATE TABLE Funcionario(
	codFunc INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nomeFunc VARCHAR(200),
    emailFunc VARCHAR(200),
    cargo VARCHAR(200),
    codPermissao INT NOT NULL,
    FOREIGN KEY (codPermissao) REFERENCES Permissao(codPermissao)
);
CREATE TABLE Equipe(
	codEquipe INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nomeEquipe VARCHAR(200)
);

CREATE TABLE Membros(
	codMembro INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    codEquipe INT NOT NULL,
    codFunc INT NOT NULL,
    FOREIGN KEY (codEquipe) REFERENCES Equipe(codEquipe),
	FOREIGN KEY (codFunc) REFERENCES Funcionario(codFunc)

);

CREATE TABLE Tarefa(
	codTarefa INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    dataInicio DATE NOT NULL,
    dataLimite DATE NOT NULL,
    statusTarefa ENUM('Pendente', 'Em andamento', 'Concluida'),
    codCriador INT NOT NULL,
    codEquipe INT NOT NULL,
	FOREIGN KEY (codEquipe) REFERENCES Equipe(codEquipe),
	FOREIGN KEY (codCriador) REFERENCES Funcionario(codFunc)

);

