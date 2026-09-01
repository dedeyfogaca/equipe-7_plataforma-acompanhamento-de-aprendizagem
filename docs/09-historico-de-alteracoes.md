# 09 · Histórico de Alterações

> **Vértice** — Plataforma de Acompanhamento de Aprendizagem
> Documento de Visão e Requisitos · Imersão Profissional: Projeto de Software · ADSIS4S · Entrega 2

---

Registro das mudanças aplicadas ao Documento de Visão e Requisitos entre a Entrega 1 (14/08/2026) e a Entrega 2 (08/09/2026). A numeração dos requisitos existentes foi preservada; os itens novos foram acrescentados ao final de cada tabela.

---

## Composição da equipe

| Data | Item | Alteração | Motivo |
|---|---|---|---|
| 27/08/2026 | Doc. 01 e 05 | Equipe reduzida de três para dois integrantes: Andrey Fogaça e Matheus Saraiva Faustin | Brayan Gabriel Biscaia trancou o curso e deixou o projeto |

---

## Escopo

| Data | Item | Alteração | Motivo |
|---|---|---|---|
| 27/08/2026 | Doc. 05 — Escopo | "Sistema de conquistas e gamificação" saiu de *Não incluído* e passou a integrar o escopo da primeira versão | Orientação da professora, que solicitou barra de progresso das atividades e métricas de conquistas |
| 27/08/2026 | Doc. 05 — Escopo | Incluídos o cadastro de disciplinas e o cadastro de conteúdos como funcionalidades próprias | Progresso por conteúdo e por disciplina (RF10 e RF11) exige que ambos existam como cadastros, e não como texto livre dentro da atividade |
| 27/08/2026 | Doc. 05 — Escopo | Incluído "Ranking competitivo entre grupos ou entre instituições" em *Não incluído* | Delimitar a gamificação ao acompanhamento individual, evitando ampliação do escopo |
| 27/08/2026 | Doc. 05 — Restrições | Restrição de persistência passou a citar que a estrutura no navegador segue o modelo lógico do banco de dados | Manter coerência entre a Entrega 2 (modelagem de dados) e a implementação prevista |

---

## Requisitos funcionais

| Data | Item | Alteração | Motivo |
|---|---|---|---|
| 27/08/2026 | RF02 | Acrescentado o campo "perfil" ao cadastro de membros | O perfil do usuário era descrito no Doc. 04, mas não tinha origem em nenhum requisito nem lugar no modelo de dados |
| 27/08/2026 | RF03 | Campo "disciplina" removido e campo "peso" acrescentado; o vínculo passa a ser feito pelo conteúdo | A disciplina passa a ser alcançada pelo conteúdo (RN13), evitando informação duplicada; o peso é exigido pelo cálculo da RN08 |
| 27/08/2026 | RF04 | Acrescentado o filtro por disciplina | Consequência do cadastro de disciplinas (RF13) |
| 27/08/2026 | RF10 | Redação ajustada de "atividades concluídas" para "peso das atividades concluídas" | Alinhamento com a RN08, que já usava peso |
| 27/08/2026 | RF13 e RF14 | Requisitos novos: cadastro de disciplinas e cadastro de conteúdos | Sustentar RF10 e RF11 |
| 27/08/2026 | RF15, RF16 e RF17 | Requisitos novos: experiência por atividade concluída, ofensiva de dias consecutivos e conquistas por marcos | Atender à orientação da professora sobre métricas de conquistas |
| 27/08/2026 | RF18 | Requisito novo: painel de desempenho do grupo com experiência, ofensiva e conquistas por integrante | Dar uma tela de destino aos dados produzidos por RF15, RF16 e RF17 |

---

## Requisitos não funcionais

| Data | Item | Alteração | Motivo |
|---|---|---|---|
| 27/08/2026 | Tabela | Acrescentada a coluna "Categoria" | O guia da disciplina pede a indicação da categoria de cada requisito não funcional |
| 27/08/2026 | RNF08 | Requisito novo: recálculo de progresso, experiência e ofensiva em até 1 segundo | Tornar verificável o desempenho das funcionalidades novas |
| 27/08/2026 | RNF09 | Requisito novo: progresso e status legíveis sem depender apenas da cor | Acessibilidade; a interface passa a depender muito de cor com a introdução das barras de progresso |

---

## Regras de negócio

| Data | Item | Alteração | Motivo |
|---|---|---|---|
| 27/08/2026 | RN01 | Ampliada para citar disciplinas e conteúdos | Novas entidades do grupo |
| 27/08/2026 | RN02 | Cascata ampliada para disciplinas e conteúdos | Novas entidades do grupo |
| 27/08/2026 | RN07 | Ampliada para incluir a gestão de disciplinas e conteúdos entre as permissões exclusivas do organizador | Coerência com o Doc. 04 |
| 27/08/2026 | RN09 a RN14 | Regras novas: faixa e padrão do peso, cálculo e estorno da experiência, cálculo da ofensiva, unicidade da conquista, obrigatoriedade do vínculo atividade–conteúdo–disciplina e cálculo do progresso da disciplina | Sustentar os requisitos novos e eliminar ambiguidade no cálculo do progresso |

---

## Pendência registrada

| Item | Situação |
|---|---|
| Persistência em banco de dados relacional | A Entrega 2 apresenta o modelo conceitual, o modelo lógico e o dicionário de dados completos. A implementação da primeira versão mantém a persistência no navegador, replicando a estrutura definida no modelo lógico, conforme a restrição do Doc. 05. A migração para um servidor de banco de dados fica prevista para uma versão futura. |

---

### Navegação

[⬅ Anterior: Regras de Negócio](08-regras-de-negocio.md) · [Índice](../README.md) · [Próximo: Casos de Uso ➡](10-casos-de-uso.md)
