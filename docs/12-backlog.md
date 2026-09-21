# 12 · Backlog do Projeto

> **Vértice** — Plataforma de Acompanhamento de Aprendizagem
> Documento de Visão e Requisitos · Imersão Profissional: Projeto de Software · ADSIS4S · Entrega 3

---

O backlog reúne as tarefas de desenvolvimento do MVP, cada uma ligada ao requisito que a origina. A ordem de execução segue a dependência entre elas: não é possível calcular progresso de conteúdo antes de existir conteúdo, nem creditar experiência antes de existir conclusão.

Estados usados: **A fazer**, **Em andamento** e **Concluída**.

---

## Situação geral

| Situação | Tarefas |
|---|---|
| Concluída | 10 |
| Em andamento | 3 |
| A fazer | 11 |
| **Total** | **24** |

As dez tarefas concluídas correspondem ao que a aplicação já executa hoje: grupos e carga de exemplo, membros com avatar, atividades sem peso, listagem com filtros, detalhe da atividade, painel de totais, tema e encerramento de sessão.

---

## Estrutura do grupo

| ID | Tarefa | Requisito | Prioridade | Responsável | Status |
|---|---|---|---|---|---|
| T01 | Tela de acesso com seleção e criação de grupo | RF01 | Alta | Andrey | Concluída |
| T02 | Carga de dados de exemplo na tela de acesso | RF20 | Baixa | Andrey | Concluída |
| T03 | Cadastro, edição e exclusão de membros | RF02 | Alta | Andrey | Concluída |
| T04 | Avatar do membro com sorteio de semente | RF19 | Baixa | Andrey | Concluída |
| T05 | Encerramento da sessão do grupo | RF09 | Média | Andrey | Concluída |
| T06 | Entidade disciplina: modelo, tela e formulário | RF13 | Alta | Matheus | Em andamento |
| T07 | Entidade conteúdo vinculada à disciplina | RF14 | Alta | Matheus | Em andamento |
| T08 | Estado vazio orientando disciplina → conteúdo → atividade | RNF07 | Média | Andrey | A fazer |

---

## Atividades

| ID | Tarefa | Requisito | Prioridade | Responsável | Status |
|---|---|---|---|---|---|
| T09 | Cadastro e edição de atividade | RF03 | Alta | Andrey | Concluída |
| T10 | Listagem com busca, filtros e ordenação | RF04 | Alta | Andrey | Concluída |
| T11 | Detalhe da atividade com alteração de status | RF05 | Alta | Andrey | Concluída |
| T12 | Campo peso no formulário, com escala de 1 a 5 | RF03, RN09 | Alta | Matheus | Em andamento |
| T13 | Vínculo obrigatório atividade → conteúdo no formulário | RF03, RN13 | Alta | Matheus | A fazer |
| T14 | Tornar o responsável opcional na validação | RN06, RN10 | Média | Andrey | A fazer |
| T15 | Filtros como painel lateral fixo | RF04, RNF01 | Média | Andrey | A fazer |
| T16 | Cartões de situação clicáveis, funcionando como filtro | RF06 | Média | Andrey | A fazer |

---

## Progresso e desempenho

| ID | Tarefa | Requisito | Prioridade | Responsável | Status |
|---|---|---|---|---|---|
| T17 | Painel com totais por status e atividades atrasadas | RF06 | Alta | Andrey | Concluída |
| T18 | Cálculo do progresso por conteúdo a partir do peso | RF10, RN08 | Alta | Matheus | A fazer |
| T19 | Agregação do progresso por disciplina | RF11, RN14 | Alta | Matheus | A fazer |
| T20 | Barras de progresso no painel e na tela de disciplinas | RF10, RF11 | Alta | Andrey | A fazer |
| T21 | Crédito e estorno de experiência ao concluir e reverter | RF15, RN10 | Alta | Matheus | A fazer |
| T22 | Retorno visual da conclusão: progresso antes e depois | RF15 | Média | Andrey | A fazer |

---

## Interface e ajustes visuais

| ID | Tarefa | Requisito | Prioridade | Responsável | Status |
|---|---|---|---|---|---|
| T23 | Tema claro e escuro | RF08 | Baixa | Andrey | Concluída |
| T24 | Aplicar a revisão visual: tipografia, cor da gamificação e layout de três colunas | RNF06 | Média | Andrey | A fazer |

---

## Dependências entre tarefas

Algumas tarefas não podem começar antes de outras terminarem. A ordem abaixo é a sequência mínima para chegar ao fluxo completo do MVP:

```
T06 disciplina  →  T07 conteúdo  →  T13 vínculo da atividade
                                         ↓
                                    T12 peso
                                         ↓
                        T18 progresso do conteúdo  →  T19 progresso da disciplina
                                         ↓                        ↓
                                    T21 experiência        T20 barras na tela
                                         ↓
                                    T22 retorno da conclusão
```

O caminho crítico é **T06 → T07 → T13 → T12 → T18 → T21**. Qualquer atraso nessas seis tarefas empurra a data do MVP; as demais podem ser feitas em paralelo.

---

## Divisão do trabalho

| Integrante | Frente | Tarefas |
|---|---|---|
| **Andrey Fogaça** | Interface, telas e experiência de uso | T01, T02, T03, T04, T05, T08, T09, T10, T11, T14, T15, T16, T17, T20, T22, T23, T24 |
| **Matheus Saraiva Faustin** | Modelo de dados e regras de cálculo | T06, T07, T12, T13, T18, T19, T21 |

A divisão indica quem conduz a tarefa, não quem é o único a conhecê-la. As tarefas do Matheus concentram as regras que sustentam o progresso (RN08, RN09, RN13, RN14 e RN10); as do Andrey concentram a tradução dessas regras em tela.

---

### Navegação

[⬅ Anterior: Matriz de Rastreabilidade](11-matriz-de-rastreabilidade.md) · [Índice](../README.md) · [Próximo: Arquitetura ➡](13-arquitetura.md)
