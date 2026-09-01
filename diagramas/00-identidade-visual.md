# Identidade visual dos diagramas

> **Vértice** — Plataforma de Acompanhamento de Aprendizagem
> Entrega 2 · Modelagem do Software · Equipe 7

---

Os diagramas deste repositório usam o mesmo sistema de cores e a mesma tipografia da aplicação, definidos em `src/styles/theme.js`. A intenção é que documento, modelos e telas sejam lidos como o mesmo produto, e não como artefatos produzidos em ferramentas diferentes.

---

## Paleta

| Papel | Cor | Onde aparece nos diagramas |
|---|---|---|
| Ciano — marca e ações principais | `#0891B2` | Atores, casos de uso e entidades do núcleo do domínio |
| Verde limão — acento da marca | `#4D7C0F` | Início e fim dos fluxos, classe associativa |
| Âmbar — status "fazendo" e alerta | `#D97706` | Losangos de decisão e avisos |
| Verde — status "concluído" | `#16A34A` | Passos que geram ganho para o estudante: experiência, conquista, progresso |
| Rosa — perigo | `#DC2626` | Erros de validação e estorno de experiência |
| Cinza-azulado — neutro | `#64748B` | Sistemas externos, enumerações e ações sem efeito no progresso |

As cores são as da paleta `coresClaras` do arquivo de tema, escolhida por atravessar bem os três meios em que os diagramas serão vistos: o documento entregue, a impressão e a leitura no GitHub. Nenhuma cor foi inventada para os diagramas.

---

## Tipografia

| Uso | Fonte |
|---|---|
| Rótulos de nós, entidades e classes | **Space Grotesk** — a mesma do corpo de texto da aplicação |
| Rótulos de transição e de relacionamento | **Space Mono** — a mesma dos rótulos de dados da interface |

---

## Vocabulário de formas

```mermaid
%%{init: {"theme": "base", "fontFamily": "Space Grotesk", "themeVariables": {"fontFamily": "Space Grotesk, Segoe UI, sans-serif", "fontSize": "15px", "primaryColor": "#F5F7FC", "primaryTextColor": "#0B1220", "primaryBorderColor": "#CDD4E1", "lineColor": "#5B6678", "secondaryColor": "#EEF7DD", "tertiaryColor": "#FAFBFE", "clusterBkg": "#FAFBFE", "clusterBorder": "#CDD4E1", "edgeLabelBackground": "#FFFFFF", "titleColor": "#0E7490", "nodeBorder": "#CDD4E1", "mainBkg": "#F5F7FC", "textColor": "#0B1220"}, "flowchart": {"curve": "basis", "padding": 18, "nodeSpacing": 48, "rankSpacing": 58}}}%%
flowchart LR
    L1(("Ator"))
    L2(["Caso de uso"])
    L3(("Sistema<br/>externo"))
    L4([Início ou fim])
    L5[Ação do sistema]
    L6{Decisão}
    L7[Ganho para o estudante]
    L8[Erro ou estorno]

    L1 ~~~ L2 ~~~ L3
    L4 ~~~ L5 ~~~ L6
    L7 ~~~ L8

    classDef ator fill:#E0F7FC,stroke:#0891B2,stroke-width:2.5px,color:#0B1220
    classDef externo fill:#EEF1F6,stroke:#64748B,stroke-width:2px,color:#0B1220,stroke-dasharray:5 4
    classDef uc fill:#FFFFFF,stroke:#0891B2,stroke-width:1.6px,color:#0B1220
    classDef terminal fill:#EEF7DD,stroke:#4D7C0F,stroke-width:2.5px,color:#3F6212
    classDef acao fill:#F5F7FC,stroke:#CDD4E1,stroke-width:1.6px,color:#0B1220
    classDef decisao fill:#FEF3D7,stroke:#D97706,stroke-width:2px,color:#5C3A05
    classDef ganho fill:#E3F7EC,stroke:#16A34A,stroke-width:2px,color:#0B3D21
    classDef erro fill:#FDE7E7,stroke:#DC2626,stroke-width:2px,color:#7F1616
    class L1 ator
    class L2 uc
    class L3 externo
    class L4 terminal
    class L5 acao
    class L6 decisao
    class L7 ganho
    class L8 erro
```

| Forma | Significado |
|---|---|
| Círculo ciano preenchido | Ator do sistema — quem inicia a interação |
| Círculo cinza tracejado | Sistema externo — participa, mas não inicia nada |
| Pílula com borda ciano | Caso de uso |
| Pílula verde limão | Início e fim de um fluxo |
| Retângulo neutro | Ação executada pelo usuário ou pelo sistema |
| Losango âmbar | Ponto de decisão, sempre com as saídas rotuladas |
| Retângulo verde | Passo que devolve ganho ao estudante |
| Retângulo rosa | Erro de validação ou estorno |

---

## Como os diagramas são mantidos

Os arquivos `.md` deste repositório trazem o código-fonte dos diagramas em Mermaid, já com o tema aplicado. O GitHub os renderiza automaticamente, e qualquer alteração é feita no texto, sem depender de ferramenta de desenho. As imagens em `diagramas/png/` são a exportação desses mesmos arquivos, para inserir no documento entregue.

---

### Navegação

[Índice](../README.md) · [Próximo: Casos de Uso ➡](01-casos-de-uso.md)
