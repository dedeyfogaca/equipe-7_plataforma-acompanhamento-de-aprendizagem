# 08 · Regras de Negócio

> **Vértice** — Plataforma de Acompanhamento de Aprendizagem
> Documento de Visão e Requisitos · Imersão Profissional: Projeto de Software · ADSIS4S · Entrega 2 (revisão da Entrega 1)

---

| ID | Descrição | Prioridade | Dependência |
|---|---|---|---|
| **RN01** | Cada grupo enxerga exclusivamente as disciplinas, os conteúdos, os membros e as atividades vinculados a ele. | Alta | RF01 |
| **RN02** | A exclusão de um grupo remove, em cascata, suas disciplinas, conteúdos, membros e atividades; a exclusão de uma disciplina remove seus conteúdos e as atividades vinculadas a eles; a exclusão de um membro mantém as atividades no grupo, sem responsável definido. | Alta | RF01, RF02, RF13 |
| **RN03** | O responsável atribuído a uma atividade deve ser um membro do grupo ao qual a atividade pertence. | Alta | RF03 |
| **RN04** | O status de uma atividade deve ser obrigatoriamente um entre "a fazer", "fazendo" e "concluído"; toda atividade criada sem status definido inicia como "a fazer". | Alta | RF03 |
| **RN05** | Uma atividade é considerada atrasada quando seu prazo é anterior à data atual e seu status é diferente de "concluído". | Alta | RF03 |
| **RN06** | O título e o prazo da atividade são obrigatórios; o título deve conter no mínimo 3 caracteres e o prazo deve corresponder a uma data válida. | Alta | RF03 |
| **RN07** | Apenas o estudante organizador pode excluir o grupo, gerenciar seus membros e gerenciar disciplinas e conteúdos; os demais integrantes podem cadastrar e editar atividades. | Alta | RF01, RF02, RF13 |
| **RN08** | O progresso de um conteúdo corresponde à razão entre o peso das atividades concluídas e o peso total das atividades previstas; conteúdos sem atividades cadastradas não entram no cálculo. | Alta | RF10 |
| **RN09** | O peso de uma atividade deve ser um número inteiro entre 1 e 5; atividades criadas sem peso definido recebem peso 1. | Alta | RF03 |
| **RN10** | A conclusão de uma atividade credita ao responsável experiência equivalente ao peso da atividade multiplicado por 10. O crédito ocorre uma única vez por atividade e é estornado caso o status deixe de ser "concluído". Atividades sem responsável não geram experiência. | Alta | RF15 |
| **RN11** | A ofensiva de um estudante corresponde ao número de dias consecutivos, contados até a data atual, em que ele concluiu ao menos uma atividade. Um dia sem nenhuma conclusão zera a ofensiva. | Média | RF16 |
| **RN12** | Uma conquista é concedida uma única vez por estudante, no instante em que o marco correspondente é atingido, e não é revogada por alterações posteriores. | Média | RF17 |
| **RN13** | Toda atividade deve estar vinculada a exatamente um conteúdo, e todo conteúdo a exatamente uma disciplina. Não é permitido excluir um conteúdo que possua atividades vinculadas sem excluir também essas atividades. | Alta | RF03, RF14 |
| **RN14** | O progresso de uma disciplina corresponde à razão entre o peso das atividades concluídas de todos os seus conteúdos e o peso total dessas atividades; disciplinas sem atividades cadastradas não entram no cálculo. Essa razão é a forma de agregação prevista no RF11: conteúdos com mais peso pesam mais no resultado da disciplina. | Alta | RF11 |

---

## Marcos das conquistas (referência da RN12)

| Código | Conquista | Condição |
|---|---|---|
| `PRIMEIRO_PASSO` | Primeiro Passo | Concluir a primeira atividade |
| `CONTEUDO_DOMINADO` | Conteúdo Dominado | Levar um conteúdo a 100% de progresso |
| `DISCIPLINA_FECHADA` | Disciplina Fechada | Levar uma disciplina a 100% de progresso |
| `SEMANA_CHEIA` | Semana Cheia | Alcançar ofensiva de 7 dias |
| `MES_CHEIO` | Mês Cheio | Alcançar ofensiva de 30 dias |
| `MEIO_MILHAR` | Meio Milhar | Acumular 500 pontos de experiência |

---

### Navegação

[⬅ Anterior: Requisitos Não Funcionais](07-requisitos-nao-funcionais.md) · [Índice](../README.md) · [Próximo: Histórico de Alterações ➡](09-historico-de-alteracoes.md)
