# 14 · Produto Mínimo Viável

> **Vértice** — Plataforma de Acompanhamento de Aprendizagem
> Documento de Visão e Requisitos · Imersão Profissional: Projeto de Software · ADSIS4S · Entrega 3

---

## O critério usado

O Vértice existe para responder uma pergunta: **o quanto o estudante já avançou em cada disciplina**. Tudo o que é preciso para responder isso do início ao fim é indispensável. Tudo o que torna a resposta mais rica, mas não a produz, é desejável.

Por esse critério, o MVP é o ciclo que vai de cadastrar a estrutura de estudo até ver a barra de progresso se mover — mais a experiência creditada na conclusão, que é o retorno imediato do esforço.

O que **não** entrou no MVP não entrou por ser menos importante, e sim por não ser necessário para o ciclo fechar. A ofensiva de dias consecutivos, por exemplo, só faz sentido depois de existirem várias conclusões ao longo do tempo: ela não tem o que medir numa primeira versão.

---

## Classificação dos requisitos

| Requisito | Classificação | No MVP? | Justificativa |
|---|---|---|---|
| **RF01** — Criar, selecionar e excluir grupos | Indispensável | Sim | É a porta de entrada. Sem grupo não existe nada mais |
| **RF02** — Gerenciar membros | Indispensável | Sim | A atividade precisa de responsável para creditar experiência |
| **RF13** — Gerenciar disciplinas | Indispensável | Sim | É a unidade em que o progresso é lido |
| **RF14** — Gerenciar conteúdos | Indispensável | Sim | É onde o progresso é calculado; sem ele não há onde ancorar a atividade |
| **RF03** — Cadastrar atividade com peso | Indispensável | Sim | O peso é o que transforma execução em medida |
| **RF04** — Listar com busca, filtros e ordenação | Indispensável | Sim | Com poucas atividades seria dispensável; com um semestre inteiro, não |
| **RF05** — Detalhe e alteração de status | Indispensável | Sim | É onde a conclusão acontece |
| **RF06** — Painel com totais e atrasadas | Indispensável | Sim | Primeira tela da sessão; é ela que responde "como estamos" |
| **RF10** — Progresso por conteúdo | Indispensável | Sim | O cálculo central do produto |
| **RF11** — Progresso por disciplina | Indispensável | Sim | A leitura que o estudante procura |
| **RF15** — Experiência por atividade concluída | Indispensável | Sim | Retorno imediato da conclusão. Sem ele, concluir não devolve nada ao estudante |
| **RF09** — Encerrar sessão | Indispensável | Sim | Trocar de grupo exige sair do atual |
| **RF19** — Avatar do membro | Indispensável | Sim | Já implementado. Identifica quem é quem nas listagens sem custo adicional |
| **RF20** — Carregar dados de exemplo | Indispensável | Sim | Já implementado. É como alguém conhece o sistema sem cadastrar nada antes |
| **RF08** — Tema claro e escuro | Indispensável | Sim | Já implementado e prototipado nos dois temas. Removê-lo do MVP custaria retrabalho para tirar algo que funciona |
| **RF16** — Ofensiva de dias consecutivos | Desejável | Não | Precisa de histórico de vários dias para ter o que mostrar |
| **RF17** — Conquistas por marcos | Desejável | Não | Depende de experiência e ofensiva já acumuladas |
| **RF18** — Painel de desempenho do grupo | Desejável | Não | Comparação entre integrantes; depende de RF16 e RF17 |
| **RF12** — Histórico de progresso ao longo do tempo | Desejável | Não | Só tem o que exibir depois de semanas de uso |
| **RF07** — Sinalizar prazo em feriado | Desejável | Não | Conveniência; a data continua visível sem isso |
| **RF21** — Relação dos próximos feriados | Desejável | Não | Mesma razão do RF07 |
| **RF22** — Sinalizar prazo em fim de semana | Desejável | Não | Mesma razão do RF07 |
| Persistência em MySQL | Futura | Não | O modelo já existe; a troca da camada de acesso fica para depois do MVP |
| Notificações por e-mail ou push | Futura | Não | Exige servidor, que esta versão não tem |
| Exportação de relatórios | Futura | Não | Nenhum requisito do bimestre depende disso |
| Aplicativo móvel nativo | Futura | Não | A interface responsiva (RNF01) já cobre o uso em celular |

**Resumo:** 15 requisitos no MVP, 7 desejáveis para a versão seguinte e 4 itens de escopo deixados para o futuro.

---

## O fluxo completo

O fluxo abaixo pode ser executado do início ao fim com o que está no MVP. É ele que será demonstrado na apresentação.

```
Entrar no grupo  →  Cadastrar disciplina  →  Cadastrar conteúdo
                                                     ↓
                                            Cadastrar atividade
                                            (conteúdo, peso, prazo, responsável)
                                                     ↓
                                            Concluir a atividade
                                                     ↓
                    Progresso do conteúdo sobe  →  Progresso da disciplina sobe
                                                     ↓
                                            Experiência creditada ao responsável
```

### O que participa de cada passo

| Passo | Requisitos | Caso de uso | Entidades | Tela |
|---|---|---|---|---|
| Entrar no grupo | RF01 | UC01 | `grupo` | Acesso |
| Cadastrar disciplina | RF13 | UC03 | `grupo`, `disciplina` | Disciplinas |
| Cadastrar conteúdo | RF14 | UC04 | `disciplina`, `conteudo` | Disciplinas |
| Cadastrar atividade | RF03 | UC05 | `atividade`, `conteudo`, `membro` | Nova atividade |
| Concluir a atividade | RF05, RF15 | UC07 | `atividade`, `membro` | Detalhe da atividade |
| Ver o progresso subir | RF06, RF10, RF11 | UC08 | `conteudo`, `disciplina`, `atividade` | Painel |

### Por que esse fluxo e não outro

Ele atravessa as três camadas do domínio — estrutura, execução e medida — e termina onde o produto entrega o seu valor. Um fluxo que parasse em "cadastrar atividade" demonstraria um gerenciador de tarefas. É o passo seguinte, a barra se movendo, que demonstra o Vértice.

O momento decisivo é a conclusão. Ali, uma ação isolada do estudante vira três coisas ao mesmo tempo: progresso no conteúdo, progresso na disciplina e experiência acumulada. É a única tela em que se vê, junto, o que o sistema faz com o que a pessoa fez.

---

## Situação da construção

Das 24 tarefas do [backlog](12-backlog.md), 23 estão concluídas. As 6 do caminho crítico — as que separavam um gerenciador de tarefas de um sistema que mede aprendizagem — foram executadas:

| Tarefa | O que entrou |
|---|---|
| T06, T07 | Disciplina e conteúdo como cadastros próprios, com tela e formulário |
| T13 | Vínculo obrigatório da atividade a um conteúdo (RN13) |
| T12 | Campo peso, escala de 1 a 5, padrão 1 (RN09) |
| T18, T19 | Progresso por conteúdo e por disciplina, por razão de pesos somados (RN08, RN14) |
| T21 | Crédito e estorno de experiência, `peso × 10` (RN10) |

Das dezessete regras de negócio, quinze estão implementadas. As duas de fora são a **RN11** (ofensiva) e a **RN12** (conquistas), que pertencem a requisitos desejáveis e ficaram para a versão seguinte por decisão da equipe. Nenhuma das duas ficou bloqueada: a data de conclusão da atividade passou a ser gravada, e é dela que a ofensiva depende.

Sobra a **T24**, parcial: a revisão visual está aplicada à tipografia, ao cartão de atividade, às situações como filtro, à casca de três colunas, ao calendário e às telas de disciplinas e membros. As telas de detalhe e de acesso continuam no desenho anterior.

### A migração dos dados

A troca de formato não podia apagar o que quem já usava o sistema tinha feito. A atividade guardava a disciplina como texto livre; o modelo alvo exige a cadeia atividade → conteúdo → disciplina → grupo.

A conversão cria uma disciplina para cada nome distinto que aparecia nas atividades, um conteúdo "Geral" dentro de cada uma para recebê-las, atribui peso 1 às que não tinham (RN09) e define o perfil dos membros (RN07). Roda uma vez só, controlada por um marcador de versão gravado junto com os dados.

---

### Navegação

[⬅ Anterior: Arquitetura](13-arquitetura.md) · [Índice](../README.md) · [Próximo: Protótipos ➡](../prototipos/01-telas-e-navegacao.md)
