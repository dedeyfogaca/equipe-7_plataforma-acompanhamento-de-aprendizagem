# Diagrama de Casos de Uso

> **Vértice** — Plataforma de Acompanhamento de Aprendizagem
> Entrega 2 · Modelagem do Software · Equipe 7

---

O diagrama apresenta os atores do sistema e as funcionalidades que cada um utiliza. O retângulo delimita a fronteira do Vértice: o que está dentro é responsabilidade do sistema, o que está fora são os atores.

O **Estudante Organizador** herda todas as funcionalidades do **Estudante Participante** e acrescenta a gestão da estrutura do grupo. A **BrasilAPI** é um ator secundário: não inicia nenhuma funcionalidade, apenas fornece a lista de feriados nacionais quando o sistema a consulta.

```mermaid
%%{init: {"theme": "base", "fontFamily": "Space Grotesk", "themeVariables": {"fontFamily": "Space Grotesk, Segoe UI, sans-serif", "fontSize": "15px", "primaryColor": "#F5F7FC", "primaryTextColor": "#0B1220", "primaryBorderColor": "#CDD4E1", "lineColor": "#5B6678", "secondaryColor": "#EEF7DD", "tertiaryColor": "#FAFBFE", "clusterBkg": "#FAFBFE", "clusterBorder": "#CDD4E1", "edgeLabelBackground": "#FFFFFF", "titleColor": "#0E7490", "nodeBorder": "#CDD4E1", "mainBkg": "#F5F7FC", "textColor": "#0B1220"}, "flowchart": {"curve": "basis", "padding": 18, "nodeSpacing": 48, "rankSpacing": 58}}}%%
flowchart LR
    ORG(("Estudante<br/>Organizador"))
    PAR(("Estudante<br/>Participante"))
    API(("BrasilAPI<br/>sistema externo"))

    subgraph SIS["SISTEMA VÉRTICE"]
        direction TB
        UC01(["UC01 · Gerenciar grupo de estudo"])
        UC02(["UC02 · Gerenciar membros"])
        UC03(["UC03 · Gerenciar disciplinas"])
        UC04(["UC04 · Gerenciar conteúdos"])
        UC05(["UC05 · Cadastrar atividade"])
        UC06(["UC06 · Consultar atividades"])
        UC07(["UC07 · Concluir atividade"])
        UC08(["UC08 · Acompanhar progresso"])
        UC09(["UC09 · Consultar painel de desempenho"])
        UC10(["UC10 · Alternar tema"])
        UC11(["UC11 · Encerrar sessão"])
    end

    ORG -. herda .-> PAR

    ORG --- UC01
    ORG --- UC02
    ORG --- UC03
    ORG --- UC04

    PAR --- UC05
    PAR --- UC06
    PAR --- UC07
    PAR --- UC08
    PAR --- UC09
    PAR --- UC10
    PAR --- UC11

    UC06 --- API
    UC08 --- API

    UC07 -. inclui .-> UC08

    classDef ator fill:#E0F7FC,stroke:#0891B2,stroke-width:2.5px,color:#0B1220
    classDef externo fill:#EEF1F6,stroke:#64748B,stroke-width:2px,color:#0B1220,stroke-dasharray:5 4
    classDef uc fill:#FFFFFF,stroke:#0891B2,stroke-width:1.6px,color:#0B1220
    classDef terminal fill:#EEF7DD,stroke:#4D7C0F,stroke-width:2.5px,color:#3F6212
    classDef acao fill:#F5F7FC,stroke:#CDD4E1,stroke-width:1.6px,color:#0B1220
    classDef decisao fill:#FEF3D7,stroke:#D97706,stroke-width:2px,color:#5C3A05
    classDef ganho fill:#E3F7EC,stroke:#16A34A,stroke-width:2px,color:#0B3D21
    classDef erro fill:#FDE7E7,stroke:#DC2626,stroke-width:2px,color:#7F1616
    class ORG,PAR ator
    class API externo
    class UC01,UC02,UC03,UC04,UC05,UC06,UC07,UC08,UC09,UC10,UC11 uc
    style SIS fill:#FAFBFE,stroke:#CDD4E1,stroke-width:1.6px,color:#0E7490
    linkStyle default stroke:#5B6678,stroke-width:1.6px

    classDef ator fill:#E0F7FC,stroke:#0891B2,stroke-width:2.5px,color:#0B1220
    classDef externo fill:#EEF1F6,stroke:#64748B,stroke-width:2px,color:#0B1220,stroke-dasharray:5 4
    classDef uc fill:#FFFFFF,stroke:#0891B2,stroke-width:1.6px,color:#0B1220
    classDef terminal fill:#EEF7DD,stroke:#4D7C0F,stroke-width:2.5px,color:#3F6212
    classDef acao fill:#F5F7FC,stroke:#CDD4E1,stroke-width:1.6px,color:#0B1220
    classDef decisao fill:#FEF3D7,stroke:#D97706,stroke-width:2px,color:#5C3A05
    classDef ganho fill:#E3F7EC,stroke:#16A34A,stroke-width:2px,color:#0B3D21
    classDef erro fill:#FDE7E7,stroke:#DC2626,stroke-width:2px,color:#7F1616
    class ORG,PAR ator
    class API externo
    class UC01,UC02,UC03,UC04,UC05,UC06,UC07,UC08,UC09,UC10,UC11 uc
    style SIS fill:#FAFBFE,stroke:#CDD4E1,stroke-width:1.6px,color:#0E7490
    linkStyle default stroke:#5B6678,stroke-width:1.6px
```

> Versão em imagem para inserir no documento: [`png/casos-de-uso.png`](png/casos-de-uso.png)

---

## Correspondência entre casos de uso e requisitos

| Caso de uso | Requisitos atendidos | Ator principal |
|---|---|---|
| UC01 · Gerenciar grupo de estudo | RF01 | Estudante Organizador |
| UC02 · Gerenciar membros | RF02 | Estudante Organizador |
| UC03 · Gerenciar disciplinas | RF13 | Estudante Organizador |
| UC04 · Gerenciar conteúdos | RF14 | Estudante Organizador |
| UC05 · Cadastrar atividade | RF03 | Estudante Participante |
| UC06 · Consultar atividades | RF04, RF05, RF07 | Estudante Participante |
| UC07 · Concluir atividade | RF05, RF15, RF16, RF17 | Estudante Participante |
| UC08 · Acompanhar progresso | RF06, RF07, RF10, RF11, RF12 | Estudante Participante |
| UC09 · Consultar painel de desempenho | RF18 | Estudante Participante |
| UC10 · Alternar tema | RF08 | Estudante Participante |
| UC11 · Encerrar sessão | RF09 | Estudante Participante |

Todos os dezoito requisitos funcionais aparecem em pelo menos um caso de uso.

---

### Navegação

[Índice](../README.md) · [Especificação dos casos de uso](../docs/10-casos-de-uso.md) · [Próximo diagrama: Classes ➡](02-classes.md)
