# 06 · Requisitos Funcionais

> **Vértice** — Plataforma de Acompanhamento de Aprendizagem
> Documento de Visão e Requisitos · Imersão Profissional: Projeto de Software · ADSIS4S · Entrega 2 (revisão da Entrega 1)

---

| ID | Descrição | Prioridade | Dependência |
|---|---|---|---|
| **RF01** | O sistema deve permitir criar, selecionar e excluir grupos de estudo. | Alta | — |
| **RF02** | O sistema deve permitir cadastrar, editar e excluir os membros do grupo, informando nome, função, e-mail e perfil. | Alta | RF01 |
| **RF03** | O sistema deve permitir cadastrar, editar e excluir atividades, informando título, descrição, conteúdo, prazo, peso, prioridade, status e responsável. | Alta | RF01, RF02, RF14 |
| **RF04** | O sistema deve exibir a lista de atividades do grupo com busca por texto, filtros por status, responsável, disciplina e prazo, e ordenação. | Alta | RF03 |
| **RF05** | O sistema deve exibir o detalhe de uma atividade e permitir a alteração do seu status. | Alta | RF03 |
| **RF06** | O sistema deve exibir um painel com o total de atividades por status, a quantidade de atividades atrasadas e as próximas entregas. | Alta | RF03 |
| **RF07** | O sistema deve sinalizar quando o prazo de uma atividade coincidir com um feriado nacional. | Baixa | RF03 |
| **RF08** | O sistema deve permitir alternar entre tema claro e escuro, mantendo a escolha entre sessões. | Baixa | — |
| **RF09** | O sistema deve encerrar a sessão do grupo mediante ação do usuário. | Média | RF01 |
| **RF10** | O sistema deve calcular e exibir o percentual de progresso de cada conteúdo a partir do peso das atividades concluídas. | Alta | RF03 |
| **RF11** | O sistema deve exibir uma barra de progresso por disciplina, agregando o progresso dos conteúdos vinculados. | Alta | RF10 |
| **RF12** | O sistema deve registrar o histórico de progresso ao longo do tempo e apresentá-lo no painel de desempenho. | Média | RF10 |
| **RF13** | O sistema deve permitir cadastrar, editar e excluir disciplinas do grupo. | Alta | RF01 |
| **RF14** | O sistema deve permitir cadastrar, editar e excluir conteúdos vinculados a uma disciplina. | Alta | RF13 |
| **RF15** | O sistema deve atribuir pontos de experiência ao responsável quando uma atividade for concluída, proporcionalmente ao peso da atividade. | Média | RF03 |
| **RF16** | O sistema deve calcular e exibir a ofensiva do estudante, correspondente ao número de dias consecutivos com pelo menos uma atividade concluída. | Média | RF15 |
| **RF17** | O sistema deve conceder conquistas ao estudante quando ele atingir os marcos previstos e exibi-las no seu perfil. | Média | RF15 |
| **RF18** | O sistema deve exibir um painel de desempenho com a experiência acumulada, a ofensiva atual e as conquistas de cada integrante do grupo. | Média | RF15, RF16, RF17 |

---

### Navegação

[⬅ Anterior: Escopo](05-escopo.md) · [Índice](../README.md) · [Próximo: Requisitos Não Funcionais ➡](07-requisitos-nao-funcionais.md)
