# 11 · Matriz de Rastreabilidade

> **Vértice** — Plataforma de Acompanhamento de Aprendizagem
> Documento de Visão e Requisitos · Imersão Profissional: Projeto de Software · ADSIS4S · Entrega 2

---

A matriz demonstra que os artefatos da Entrega 2 não foram produzidos separadamente. Cada linha conecta um requisito ao caso de uso que o realiza, às entidades de dados que o sustentam e à tela em que ele aparece.

---

## Requisitos funcionais

| Requisito | Caso de uso | Entidades envolvidas | Tela prevista |
|---|---|---|---|
| **RF01** — Criar, selecionar e excluir grupos | UC01 · Gerenciar grupo de estudo | grupo | Acesso |
| **RF02** — Gerenciar membros | UC02 · Gerenciar membros | grupo, membro | Membros |
| **RF03** — Cadastrar, editar e excluir atividades | UC05 · Cadastrar atividade | atividade, conteudo, disciplina, membro | Formulário de atividade |
| **RF04** — Listar atividades com busca, filtros e ordenação | UC06 · Consultar atividades | atividade, conteudo, disciplina, membro | Atividades |
| **RF05** — Exibir detalhe e alterar status | UC06 · Consultar atividades / UC07 · Concluir atividade | atividade, membro | Detalhe da atividade |
| **RF06** — Painel com totais, atrasadas e próximas entregas | UC08 · Acompanhar progresso | atividade | Painel |
| **RF07** — Sinalizar prazo em feriado nacional | UC06 · Consultar atividades / UC08 · Acompanhar progresso | atividade *(ator externo: BrasilAPI)* | Painel e Atividades |
| **RF08** — Alternar tema claro e escuro | UC10 · Alternar tema | *nenhuma; preferência local do dispositivo* | Cabeçalho, em todas as telas |
| **RF09** — Encerrar a sessão do grupo | UC11 · Encerrar sessão | grupo | Cabeçalho, em todas as telas |
| **RF10** — Calcular e exibir progresso do conteúdo | UC08 · Acompanhar progresso | conteudo, atividade | Disciplinas e Painel |
| **RF11** — Barra de progresso por disciplina | UC08 · Acompanhar progresso | disciplina, conteudo, atividade | Painel |
| **RF12** — Registrar e exibir histórico de progresso | UC07 · Concluir atividade / UC08 · Acompanhar progresso | progresso_historico, disciplina | Painel |
| **RF13** — Gerenciar disciplinas | UC03 · Gerenciar disciplinas | grupo, disciplina | Disciplinas |
| **RF14** — Gerenciar conteúdos | UC04 · Gerenciar conteúdos | disciplina, conteudo | Disciplinas, seção de conteúdos |
| **RF15** — Atribuir experiência por atividade concluída | UC07 · Concluir atividade | atividade, membro | Detalhe da atividade e Desempenho |
| **RF16** — Calcular e exibir a ofensiva | UC07 · Concluir atividade / UC09 · Consultar painel de desempenho | atividade, membro | Desempenho |
| **RF17** — Conceder e exibir conquistas | UC07 · Concluir atividade / UC09 · Consultar painel de desempenho | conquista, membro_conquista, membro | Desempenho |
| **RF18** — Painel de desempenho do grupo | UC09 · Consultar painel de desempenho | membro, atividade, conquista, membro_conquista | Desempenho |

Os dezoito requisitos funcionais possuem caso de uso e tela. O único requisito sem entidade de dados é o RF08, porque a escolha do tema é uma preferência do dispositivo e não um dado do domínio.

---

## Regras de negócio

| Regra | Onde é aplicada | Artefato que a representa |
|---|---|---|
| **RN01** — isolamento por grupo | Consultas de todas as telas privadas | Modelo lógico: encadeamento das chaves estrangeiras até `grupo` |
| **RN02** — exclusão em cascata | UC01, UC02, UC03 | Modelo lógico: `ON DELETE CASCADE` e `ON DELETE SET NULL` |
| **RN03** — responsável do mesmo grupo | UC05, passo 5B | Validação na aplicação, registrada no modelo lógico |
| **RN04** — status válido e padrão | UC05, passo 7 | Modelo lógico: `CHECK` e valor padrão em `atividade.status` |
| **RN05** — atividade atrasada | UC08, passo 2 | Consulta de referência no script de criação |
| **RN06** — título e prazo obrigatórios | UC05, passo 6 | Modelo lógico: `NOT NULL` e `CHECK` de comprimento |
| **RN07** — permissões do organizador | UC01, UC02, UC03, UC04 | Modelo lógico: `CHECK` em `membro.perfil` |
| **RN08** — progresso do conteúdo | UC07, passo 5; UC08, passo 3 | Diagrama de atividades "Concluir atividade" e consulta de referência |
| **RN09** — faixa e padrão do peso | UC05, passo 7 | Modelo lógico: `CHECK (peso BETWEEN 1 AND 5)` |
| **RN10** — crédito e estorno da experiência | UC07, passo 4 e fluxo alternativo 2A | Diagrama de atividades "Concluir atividade", incluindo o fluxo de reversão |
| **RN11** — cálculo da ofensiva | UC07, passo 6 | Campo `atividade.data_conclusao` no dicionário de dados |
| **RN12** — conquista concedida uma única vez | UC07, passo 7 | Modelo lógico: chave primária composta em `membro_conquista` |
| **RN13** — vínculo atividade–conteúdo–disciplina | UC05, passos 3 e 4 | Diagrama de atividades "Cadastrar atividade" e `id_conteudo NOT NULL` |
| **RN14** — progresso da disciplina | UC08, passo 3 | Consulta de referência no script de criação |

---

## Requisitos não funcionais

| Requisito | Onde é verificado |
|---|---|
| **RNF01** — responsividade | Todas as telas, em larguras de celular, tablet e computador |
| **RNF02** — persistência entre sessões | Recarregar a página após qualquer cadastro |
| **RNF03** — mensagem de erro por campo | UC01 fluxo 6A, UC03 fluxo 5A, UC05 fluxo 6A |
| **RNF04** — resposta em até 1 segundo na busca | UC06 |
| **RNF05** — compatibilidade entre navegadores | Chrome, Firefox e Edge |
| **RNF06** — padronização visual | Todas as telas; tokens de cor, tipografia e componentes |
| **RNF07** — mensagem em listagem vazia | UC01 fluxo 2A, UC03 fluxo 2A, UC08 fluxo 2A, UC09 fluxo 1A |
| **RNF08** — recálculo em até 1 segundo | UC07, pós-condições |
| **RNF09** — progresso legível sem depender da cor | UC08, passo 5: percentual exibido em número junto à barra |

---

## Verificação cruzada

- Todo caso de uso tem origem em pelo menos um requisito funcional.
- Todo requisito funcional aparece em pelo menos um caso de uso e em pelo menos uma tela.
- Toda entidade do modelo de dados tem origem em um requisito: `grupo` (RF01), `membro` (RF02), `disciplina` (RF13), `conteudo` (RF14), `atividade` (RF03), `progresso_historico` (RF12), `conquista` e `membro_conquista` (RF17).
- Nenhuma tela apresenta funcionalidade que não esteja documentada como requisito.
- Os nomes usados nos requisitos, nos casos de uso, nas classes, nas tabelas e nas telas são os mesmos: grupo, membro, disciplina, conteúdo, atividade, progresso, conquista.

---

### Navegação

[⬅ Anterior: Casos de Uso](10-casos-de-uso.md) · [Índice](../README.md)
