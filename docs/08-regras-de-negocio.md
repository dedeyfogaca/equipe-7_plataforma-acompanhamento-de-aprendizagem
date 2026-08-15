# 08 · Regras de Negócio

> **Vértice** — Plataforma de Acompanhamento de Aprendizagem
> Documento de Visão e Requisitos · Imersão Profissional: Projeto de Software · ADSIS4S · Entrega 1

---

| ID | Descrição | Prioridade | Dependência |
|---|---|---|---|
| **RN01** | Cada grupo enxerga exclusivamente os membros e as atividades vinculados a ele. | Alta | RF01 |
| **RN02** | A exclusão de um grupo remove, em cascata, seus membros e atividades; a exclusão de um membro mantém as atividades no grupo, sem responsável definido. | Alta | RF01, RF02 |
| **RN03** | O responsável atribuído a uma atividade deve ser um membro do grupo ao qual a atividade pertence. | Alta | RF03 |
| **RN04** | O status de uma atividade deve ser obrigatoriamente um entre "a fazer", "fazendo" e "concluído"; toda atividade criada sem status definido inicia como "a fazer". | Alta | RF03 |
| **RN05** | Uma atividade é considerada atrasada quando seu prazo é anterior à data atual e seu status é diferente de "concluído". | Alta | RF03 |
| **RN06** | O título e o prazo da atividade são obrigatórios; o título deve conter no mínimo 3 caracteres e o prazo deve corresponder a uma data válida. | Alta | RF03 |
| **RN07** | Apenas o estudante organizador pode excluir o grupo e gerenciar seus membros; os demais integrantes podem cadastrar e editar atividades. | Alta | RF01, RF02 |
| **RN08** | O progresso de um conteúdo corresponde à razão entre o peso das atividades concluídas e o peso total das atividades previstas; conteúdos sem atividades cadastradas não entram no cálculo. | Alta | RF10 |

---

### Navegação

[⬅ Anterior: Requisitos Não Funcionais](07-requisitos-nao-funcionais.md) · [Índice](../README.md)

📄 **[Documento completo — Visão e Requisitos (.docx)](Documento-de-Visao-e-Requisitos.docx)**
