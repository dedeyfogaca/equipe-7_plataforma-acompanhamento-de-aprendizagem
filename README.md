## Equipe 7
- Andrey Fogaça
- Matheus Saraiva Faustin
- Brayan Gabriel Biscaia

---

# VÉRTICE
### Plataforma de Acompanhamento de Trabalhos em Grupo

---

## RF (Requisitos Funcionais)

| ID | Descrição | Prioridade | Dependência |
|---|---|---|---|
| RF01 | O sistema deve permitir criar, selecionar e excluir grupos de estudo. | Alta | — |
| RF02 | O sistema deve permitir cadastrar, editar e excluir os membros do grupo, informando nome, função e e-mail. | Alta | RF01 |
| RF03 | O sistema deve permitir cadastrar, editar e excluir tarefas, informando título, descrição, disciplina, prazo, prioridade, status e responsável. | Alta | RF01, RF02 |
| RF04 | O sistema deve exibir a lista de tarefas do grupo com busca por texto, filtros por status, responsável e prazo, e ordenação. | Alta | RF03 |
| RF05 | O sistema deve exibir o detalhe de uma tarefa e permitir a alteração do seu status. | Alta | RF03 |
| RF06 | O sistema deve exibir um painel com o total de tarefas por status, a quantidade de tarefas atrasadas e as próximas entregas. | Alta | RF03 |
| RF07 | O sistema deve sinalizar quando o prazo de uma tarefa coincidir com um feriado nacional. | Baixa | RF03 |
| RF08 | O sistema deve permitir alternar entre tema claro e escuro, mantendo a escolha entre sessões. | Baixa | — |
| RF09 | O sistema deve encerrar a sessão do grupo mediante ação do usuário. | Média | RF01 |
| RF10 | O sistema deve calcular e exibir o percentual de progresso de cada conteúdo a partir das tarefas concluídas. | Alta | RF03 |
| RF11 | O sistema deve exibir uma barra de progresso por disciplina, agregando o progresso dos conteúdos vinculados. | Alta | RF10 |
| RF12 | O sistema deve registrar o histórico de progresso ao longo do tempo e apresentá-lo no painel de desempenho. | Média | RF10 |

## RNF (Requisitos Não Funcionais)

| ID | Descrição | Prioridade | Dependência |
|---|---|---|---|
| RNF01 | O sistema deve ser responsivo, adaptando o layout a telas de celular, tablet e computador. | Alta | — |
| RNF02 | O sistema deve preservar todos os dados cadastrados após o recarregamento ou fechamento da página. | Alta | — |
| RNF03 | O sistema deve apresentar mensagem de erro específica por campo sempre que um formulário for enviado com dados inválidos. | Alta | RF02, RF03 |
| RNF04 | O sistema deve responder às ações de busca, filtro e ordenação em até 1 segundo. | Média | RF04 |
| RNF05 | O sistema deve funcionar nas versões atuais dos navegadores Chrome, Firefox e Edge. | Média | — |
| RNF06 | O sistema deve manter padronização visual de cores, tipografia, botões e campos em todas as telas. | Média | — |
| RNF07 | O sistema deve exibir mensagem orientativa quando uma listagem não possuir registros.	| Média | RF04 |

---

## RN (Regras de Negócio)

| ID | Descrição | Prioridade | Dependência |
|---|---|---|---|
| RN01 | Cada grupo enxerga exclusivamente os membros e as tarefas vinculados a ele. | Alta | RF01 |
| RN02 | A exclusão de um grupo remove, em cascata, seus membros e tarefas; a exclusão de um membro mantém as tarefas no grupo, sem responsável definido. | Alta | RF01, RF02 |
| RN03 | O responsável atribuído a uma tarefa deve ser um membro do grupo ao qual a tarefa pertence. | Alta | RF03 |
| RN04 | O status de uma tarefa deve ser obrigatoriamente um entre "a fazer", "fazendo" e "concluído"; toda tarefa criada sem status definido inicia como "a fazer". | Alta | RF03 |
| RN05 | Uma tarefa é considerada atrasada quando seu prazo é anterior à data atual e seu status é diferente de "concluído". | Alta | RF03 |
| RN06 | O título e o prazo da tarefa são obrigatórios; o título deve conter no mínimo 3 caracteres e o prazo deve corresponder a uma data válida. | Alta | RF03 |
| RN07 | O progresso de um conteúdo corresponde à razão entre o peso das tarefas concluídas e o peso total das tarefas previstas; conteúdos sem tarefas cadastradas não entram no cálculo. | Alta | RF10 |
