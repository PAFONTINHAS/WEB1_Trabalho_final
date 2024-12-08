INSERT INTO Permissao (descricao, nivelAcesso) VALUES
('Administrador', 5),
('Gerente', 4),
('Líder de Equipe', 3),
('Funcionário', 2),
('Estagiário', 1);

INSERT INTO Funcionario (nomeFunc, emailFunc, cargo, codPermissao, ativo) VALUES
('Lucas Silva', 'lucas.silva@gmail.com', 'Analista de Sistemas', 5, 1),
('Mariana Oliveira', 'mariana.oliveira@gmail.com', 'Gerente de Projetos', 4, 1),
('Carlos Santos', 'carlos.santos@gmail.com', 'Líder de Desenvolvimento', 3, 0),
('Ana Paula', 'ana.paula@gmail.com', 'Assistente Administrativa', 2, 1),
('João Pereira', 'joao.pereira@gmail.com', 'Estagiário de TI', 1, 1),
('Fernanda Costa', 'fernanda.costa@gmail.com', 'Coordenadora de RH', 4, 0),
('Paulo Henrique', 'paulo.henrique@gmail.com', 'Analista Financeiro', 3, 0),
('Bianca Ferreira', 'bianca.ferreira@gmail.com', 'Assistente de Marketing', 2, 0),
('Ricardo Lopes', 'ricardo.lopes@gmail.com', 'Técnico em Redes', 2, 1),
('Juliana Martins', 'juliana.martins@gmail.com', 'Estagiária de Design', 1, 1),
('Ana Oliveira', 'ana.oliveira@example.com', 'Desenvolvedor', 2, 1),
('Carlos Silva', 'carlos.silva@example.com', 'Designer', 3, 1),
('Maria Souza', 'maria.souza@example.com', 'Gerente', 1, 1),
('Pedro Lima', 'pedro.lima@example.com', 'Tester', 2, 1),
('Juliana Costa', 'juliana.costa@example.com', 'Analista', 3, 0);


INSERT INTO Equipe (nomeEquipe) VALUES
('Desenvolvimento de Software'),
('Recursos Humanos'),
('Marketing Digital'),
('Suporte Técnico'),
('Financeiro');


INSERT INTO Membros (codFunc, codEquipe) VALUES
(1, 1), -- Lucas Silva na equipe Desenvolvimento de Software
(3, 1), -- Carlos Santos na equipe Desenvolvimento de Software
(6, 2), -- Fernanda Costa na equipe Recursos Humanos
(4, 2), -- Ana Paula na equipe Recursos Humanos
(8, 3), -- Bianca Ferreira na equipe Marketing Digital
(10, 3), -- Juliana Martins na equipe Marketing Digital
(9, 4), -- Ricardo Lopes na equipe Suporte Técnico
(5, 4), -- João Pereira na equipe Suporte Técnico
(2, 5), -- Mariana Oliveira na equipe Financeiro
(7, 5), -- Paulo Henrique na equipe Financeiro
(2, 1), -- Membro 2 na equipe 1
(2, 3), -- Membro 2 na equipe 3
(3, 2), -- Membro 3 na equipe 2
(3, 4), -- Membro 3 na equipe 4
(4, 1), -- Membro 4 na equipe 1
(4, 5), -- Membro 4 na equipe 2
(5, 3), -- Membro 5 na equipe 3
(5, 1), -- Membro 5 na equipe 4
(11, 1), -- Ana Oliveira na equipe 1
(12, 2), -- Carlos Silva na equipe 2
(13, 3), -- Maria Souza na equipe 3
(14, 4), -- Pedro Lima na equipe 4
(15, 5); -- Juliana Costa na equipe 5


INSERT INTO tarefa (titulo, descricao, dataInicio, dataLimite, statusTarefa, codCriador, codEquipe) VALUES
('Planejar Evento', 'Planejar o evento corporativo anual.', '2024-12-01', '2024-12-10', 'pendente', 1, 1),
('Desenvolver Sistema', 'Criar um sistema para gerenciamento de clientes.', '2024-11-20', '2025-01-20', 'em-andamento', 2, 2),
('Revisar Documentos', 'Revisar os contratos para a nova parceria.', '2024-11-25', '2024-12-05', 'esperando-aprovacao', 3, 3),
('Treinamento de Equipe', 'Organizar o treinamento sobre novas tecnologias.', '2024-12-03', '2024-12-15', 'concluida', 4, 4),
('Reunião de Avaliação', 'Realizar reunião para avaliar progresso do projeto.', '2024-12-01', '2024-12-01', 'pendente', 5, 1),
('Criar Campanha de Marketing', 'Planejar nova campanha digital.', '2024-12-02', '2024-12-12', 'em-andamento', 1, 2),
('Atualizar Infraestrutura', 'Melhorar a infraestrutura do servidor.', '2024-11-28', '2024-12-08', 'esperando-aprovacao', 2, 3),
('Contratar Novos Funcionários', 'Finalizar processo seletivo de novos membros.', '2024-12-05', '2024-12-20', 'pendente', 3, 4),
('Migrar Dados', 'Migrar dados antigos para o novo sistema.', '2024-12-03', '2024-12-14', 'concluida', 4, 2),
('Lançar Produto', 'Preparar o lançamento do novo produto.', '2024-12-01', '2024-12-31', 'em-andamento', 5, 5);


INSERT INTO Membros_tarefas (codFunc, codTarefa) VALUES
(1, 1), -- Lucas Silva está associado à tarefa "Planejar Evento"
(3, 2), -- Carlos Santos está associado à tarefa "Desenvolver Sistema"
(6, 3), -- Fernanda Costa está associada à tarefa "Revisar Documentos"
(4, 4), -- Ana Paula está associada à tarefa "Treinamento de Equipe"
(8, 5), -- Bianca Ferreira está associada à tarefa "Reunião de Avaliação"
(10, 6), -- Juliana Martins está associada à tarefa "Criar Campanha de Marketing"
(9, 7), -- Ricardo Lopes está associado à tarefa "Atualizar Infraestrutura"
(5, 8), -- João Pereira está associado à tarefa "Contratar Novos Funcionários"
(2, 9), -- Mariana Oliveira está associada à tarefa "Migrar Dados"
(7, 10), -- Paulo Henrique está associado à tarefa "Lançar Produto"
(2, 1), -- Mariana Oliveira também participa da tarefa "Planejar Evento"
(3, 5), -- Carlos Santos também participa da tarefa "Reunião de Avaliação"
(4, 6), -- Ana Paula também participa da tarefa "Criar Campanha de Marketing"
(5, 7); -- João Pereira também participa da tarefa "Atualizar Infraestrutura"

