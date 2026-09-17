# 10 · Especificação dos Casos de Uso

> **Vértice** — Plataforma de Acompanhamento de Aprendizagem
> Documento de Visão e Requisitos · Imersão Profissional: Projeto de Software · ADSIS4S · Entrega 2

---

Estão especificados a seguir os oito casos de uso prioritários. O [diagrama de casos de uso](../diagramas/01-casos-de-uso.md) apresenta os doze casos identificados e sua correspondência com os requisitos.

---

## UC01 · Gerenciar grupo de estudo

| | |
|---|---|
| **Ator principal** | Estudante Organizador |
| **Objetivo** | Criar, selecionar ou excluir um grupo de estudo, definindo o contexto de trabalho da sessão |
| **Pré-condições** | Nenhuma. É o ponto de entrada do sistema |
| **Requisitos** | RF01 |
| **Regras** | RN01, RN02, RN07 |

**Fluxo principal**

1. O estudante abre a tela de acesso.
2. O sistema exibe a lista de grupos já cadastrados no dispositivo.
3. O estudante escolhe criar um grupo novo.
4. O sistema apresenta o formulário com nome e descrição.
5. O estudante preenche o nome e confirma.
6. O sistema valida os dados, cria o grupo e registra a data de criação.
7. O sistema abre a sessão com o grupo criado e direciona o estudante ao painel.

**Fluxos alternativos**

- **3A — Selecionar grupo existente:** o estudante escolhe um grupo da lista; o sistema abre a sessão e segue para o passo 7.
- **3B — Excluir grupo:** o estudante escolhe excluir um grupo; o sistema pede confirmação, informando que disciplinas, conteúdos, membros e atividades serão removidos junto (RN02). Confirmada a exclusão, o sistema remove tudo em cascata e retorna à lista.
- **6A — Nome inválido:** se o nome estiver vazio, o sistema exibe a mensagem de erro no campo e mantém o formulário aberto (RNF03).
- **2A — Nenhum grupo cadastrado:** o sistema exibe mensagem orientativa e oferece a criação do primeiro grupo (RNF07).

**Pós-condições**

- Existe um grupo ativo na sessão e o estudante tem acesso às telas privadas do sistema.

---

## UC02 · Gerenciar membros

| | |
|---|---|
| **Ator principal** | Estudante Organizador |
| **Atores secundários** | DiceBear (imagens de avatar) |
| **Objetivo** | Manter a relação de quem participa do grupo de estudo |
| **Pré-condições** | Existe um grupo ativo na sessão e o usuário atua como organizador |
| **Requisitos** | RF02, RF19 |
| **Regras** | RN03, RN07, RN15 |

**Fluxo principal**

1. O organizador acessa a tela de membros.
2. O sistema exibe os membros já cadastrados, cada um com seu avatar, nome, função e perfil.
3. O organizador solicita o cadastro de um novo membro.
4. O sistema abre o formulário com uma semente de avatar já sorteada e apresenta a imagem correspondente (RF19, RN15).
5. O organizador informa nome, função, e-mail e perfil.
6. O organizador pode sortear outra semente quantas vezes quiser, até chegar a um avatar que lhe agrade (RF19).
7. O organizador confirma o cadastro.
8. O sistema valida os dados, grava o membro com a semente escolhida e atualiza a relação.

**Fluxos alternativos**

- **5A — Nome vazio:** o sistema exibe a mensagem de erro no campo e mantém o formulário aberto (RNF03).
- **4A — DiceBear indisponível:** o sistema exibe as iniciais do nome no lugar da imagem e permite concluir o cadastro normalmente; a semente é gravada do mesmo jeito e a imagem passa a aparecer assim que o serviço voltar (RN15, RNF10).
- **8A — Exclusão de membro responsável por atividades:** o sistema mantém as atividades e as deixa sem responsável, de modo que elas deixam de gerar experiência ao serem concluídas (RN10).

**Pós-condições**

- O membro passa a estar disponível para ser responsável por atividades (RN03).

---

## UC03 · Gerenciar disciplinas

| | |
|---|---|
| **Ator principal** | Estudante Organizador |
| **Objetivo** | Manter a lista de disciplinas que o grupo acompanha, para que as atividades possam ser ancoradas nelas |
| **Pré-condições** | Existe um grupo ativo na sessão e o usuário possui perfil de organizador |
| **Requisitos** | RF13 |
| **Regras** | RN01, RN02, RN07 |

**Fluxo principal**

1. O organizador acessa a tela de disciplinas.
2. O sistema lista as disciplinas do grupo ativo com o respectivo percentual de progresso.
3. O organizador escolhe cadastrar uma disciplina.
4. O sistema apresenta o formulário com nome e cor de identificação.
5. O organizador preenche os dados e confirma.
6. O sistema valida, grava a disciplina vinculada ao grupo ativo e atualiza a lista.

**Fluxos alternativos**

- **3A — Editar disciplina:** o organizador seleciona uma disciplina existente; o sistema abre o formulário preenchido e grava as alterações no passo 6.
- **3B — Excluir disciplina:** o sistema pede confirmação informando que os conteúdos e as atividades vinculadas serão removidos (RN02, RN13). Confirmada, remove em cascata.
- **5A — Nome vazio ou duplicado no grupo:** o sistema exibe a mensagem de erro no campo e mantém o formulário aberto (RNF03).
- **2A — Nenhuma disciplina cadastrada:** o sistema exibe mensagem orientativa convidando ao primeiro cadastro (RNF07).
- **1A — Usuário sem perfil de organizador:** o sistema não oferece as ações de cadastro, edição e exclusão (RN07).

**Pós-condições**

- A disciplina está disponível para receber conteúdos e, por meio deles, atividades.

---

## UC05 · Cadastrar atividade

| | |
|---|---|
| **Ator principal** | Estudante Participante |
| **Objetivo** | Registrar uma atividade de estudo vinculada a um conteúdo, com prazo, peso e responsável |
| **Pré-condições** | Existe um grupo ativo, ao menos um membro cadastrado e ao menos um conteúdo cadastrado |
| **Requisitos** | RF03 |
| **Regras** | RN03, RN04, RN06, RN09, RN13 |

**Fluxo principal**

1. O estudante aciona a criação de uma atividade.
2. O sistema apresenta o formulário com título, descrição, disciplina, conteúdo, prazo, peso, prioridade, status e responsável.
3. O estudante seleciona a disciplina.
4. O sistema filtra a lista de conteúdos, exibindo apenas os da disciplina escolhida (RN13).
5. O estudante preenche os demais campos e confirma.
6. O sistema valida os dados obrigatórios: título com no mínimo três caracteres, prazo com data válida e conteúdo selecionado (RN06, RN13).
7. O sistema aplica os valores padrão: status "a fazer" quando não informado (RN04) e peso 1 quando não informado (RN09).
8. O sistema grava a atividade, registra a data de criação e exibe a atividade na listagem.

**Fluxos alternativos**

- **6A — Dados inválidos:** o sistema destaca cada campo com problema e exibe a mensagem específica, mantendo o que já foi preenchido (RNF03).
- **5A — Responsável não informado:** o sistema aceita a atividade sem responsável; ela não gerará experiência ao ser concluída (RN10).
- **5B — Responsável fora do grupo:** o sistema não oferece essa opção na lista, que contém apenas os membros do grupo ativo (RN03).
- **6B — Prazo em feriado nacional:** o sistema grava a atividade normalmente e exibe um aviso informando o feriado correspondente (RF07).
- **1A — Nenhum conteúdo cadastrado:** o sistema informa que é preciso cadastrar uma disciplina e um conteúdo antes e oferece o atalho para essa tela.

**Pós-condições**

- A atividade existe, aparece nas listagens e no painel, e passa a compor o peso total do seu conteúdo para efeito de cálculo de progresso (RN08).

---

## UC07 · Concluir atividade

| | |
|---|---|
| **Ator principal** | Estudante Participante |
| **Objetivo** | Marcar uma atividade como concluída e receber o retorno correspondente em progresso, experiência, ofensiva e conquistas |
| **Pré-condições** | Existe um grupo ativo e a atividade está cadastrada com status diferente de "concluído" |
| **Requisitos** | RF05, RF15, RF16, RF17 |
| **Regras** | RN04, RN08, RN10, RN11, RN12, RN14 |

**Fluxo principal**

1. O estudante abre o detalhe da atividade ou usa a alteração rápida de status na listagem.
2. O estudante seleciona o status "concluído".
3. O sistema grava o novo status e registra a data de conclusão.
4. O sistema credita ao responsável a experiência equivalente ao peso multiplicado por 10 (RN10).
5. O sistema recalcula o progresso do conteúdo da atividade (RN08) e o progresso da disciplina correspondente (RN14).
6. O sistema recalcula a ofensiva do responsável a partir das datas de conclusão (RN11).
7. O sistema verifica os marcos de conquista e concede as que passaram a ser satisfeitas (RN12).
8. O sistema registra o progresso do dia no histórico da disciplina (RF12).
9. O sistema apresenta o retorno ao estudante: barra de progresso atualizada, experiência creditada e, quando houver, a conquista obtida.

**Fluxos alternativos**

- **2A — Reverter conclusão:** o estudante altera o status de "concluído" para outro. O sistema limpa a data de conclusão, estorna a experiência creditada, recalcula progresso e ofensiva, mas **não** revoga conquistas já concedidas (RN12).
- **4A — Atividade sem responsável:** o sistema pula o crédito de experiência, a ofensiva e as conquistas, e executa apenas o recálculo de progresso (RN10).
- **7A — Nenhum marco atingido:** o sistema segue para o passo 8 sem conceder conquista.
- **3A — Falha ao gravar:** o sistema mantém o status anterior e informa que a alteração não foi salva.

**Pós-condições**

- A atividade está com status "concluído" e data de conclusão registrada.
- O progresso do conteúdo e da disciplina, a experiência e a ofensiva do responsável refletem a mudança em até 1 segundo (RNF08).
- As conquistas atingidas estão registradas e visíveis no perfil do estudante.

---

## UC08 · Acompanhar progresso

| | |
|---|---|
| **Ator principal** | Estudante Participante |
| **Objetivo** | Visualizar o quanto o grupo já avançou em cada disciplina e conteúdo, e o que está por vencer |
| **Pré-condições** | Existe um grupo ativo na sessão |
| **Requisitos** | RF06, RF07, RF10, RF11, RF12, RF21, RF22 |
| **Regras** | RN05, RN08, RN14, RN16, RN17 |
| **Atores secundários** | BrasilAPI e Nager.Date (feriados nacionais) |

**Fluxo principal**

1. O estudante acessa o painel.
2. O sistema calcula o total de atividades por status e a quantidade de atividades atrasadas (RN05).
3. O sistema calcula o progresso de cada conteúdo (RN08) e de cada disciplina (RN14).
4. O sistema consulta a BrasilAPI para obter os feriados nacionais dos anos presentes nos prazos e guarda a relação obtida para reutilização (RN17).
5. O sistema exibe os totais, as barras de progresso por disciplina com o percentual em número, a lista de próximas entregas e o gráfico de evolução do histórico de progresso.
6. O sistema destaca as atividades cujo prazo coincide com um feriado nacional (RF07) ou com um fim de semana (RF22).
7. O sistema exibe a relação dos próximos feriados nacionais a partir da data atual (RF21).

**Fluxos alternativos**

- **3A — Disciplina sem atividades:** a disciplina não entra no cálculo e é exibida com a indicação de que ainda não possui atividades (RN08, RN14).
- **4A — BrasilAPI indisponível ou lenta:** decorrido o tempo limite de espera, o sistema consulta a fonte reserva, a Nager.Date, e segue o fluxo principal (RN17).
- **4B — As duas fontes indisponíveis:** o sistema reutiliza a última relação de feriados obtida com sucesso; não havendo nenhuma, omite a sinalização de feriados e a relação dos próximos, informa que estão indisponíveis no momento e mantém o restante do painel funcional (RN17, RNF10).
- **2A — Grupo sem atividades:** o sistema exibe mensagem orientativa e o atalho para cadastrar a primeira atividade (RNF07).
- **5A — Histórico com menos de dois registros:** o sistema exibe a barra de progresso atual e informa que a evolução aparecerá conforme o uso.

**Pós-condições**

- Nenhuma alteração nos dados. O caso de uso é apenas de consulta.

---

## UC09 · Consultar painel de desempenho

| | |
|---|---|
| **Ator principal** | Estudante Participante |
| **Objetivo** | Comparar a experiência acumulada, a ofensiva e as conquistas dos integrantes do grupo |
| **Pré-condições** | Existe um grupo ativo com ao menos um membro cadastrado |
| **Requisitos** | RF18 |
| **Regras** | RN10, RN11, RN12 |

**Fluxo principal**

1. O estudante acessa o painel de desempenho.
2. O sistema calcula, para cada membro do grupo, a experiência acumulada a partir das atividades concluídas sob sua responsabilidade (RN10).
3. O sistema calcula a ofensiva atual de cada membro (RN11).
4. O sistema recupera as conquistas obtidas por cada membro (RN12).
5. O sistema exibe um cartão por integrante com avatar, nome, experiência, ofensiva e as medalhas das conquistas obtidas.
6. O sistema exibe também as conquistas ainda não obtidas, em estado bloqueado, com a descrição do marco necessário.

**Fluxos alternativos**

- **2A — Membro sem atividades concluídas:** o cartão é exibido com experiência zero e ofensiva zero, sem mensagem de erro.
- **1A — Grupo sem membros:** o sistema exibe mensagem orientativa e o atalho para a tela de membros (RNF07).

**Pós-condições**

- Nenhuma alteração nos dados. O caso de uso é apenas de consulta.

---

## UC12 · Carregar dados de exemplo

| | |
|---|---|
| **Ator principal** | Estudante Organizador |
| **Objetivo** | Conhecer o sistema em funcionamento sem precisar cadastrar nada |
| **Pré-condições** | Nenhuma. O caso de uso ocorre na tela de entrada, antes de existir grupo ativo |
| **Requisitos** | RF20 |
| **Regras** | RN01 |

**Fluxo principal**

1. O usuário aciona a carga de dados de exemplo na tela de entrada.
2. O sistema cria um grupo de demonstração já preenchido, com membros, disciplinas, conteúdos e atividades em diferentes status e prazos.
3. O sistema inicia a sessão nesse grupo e apresenta o painel.

**Fluxos alternativos**

- **2A — Já existe um grupo de demonstração:** o sistema cria um novo grupo, sem alterar nem sobrescrever os grupos existentes (RN01).

**Pós-condições**

- O grupo de demonstração passa a existir como qualquer outro grupo: pode ser usado, editado e excluído pelo usuário.

---

### Navegação

[⬅ Anterior: Histórico de Alterações](09-historico-de-alteracoes.md) · [Índice](../README.md) · [Próximo: Matriz de Rastreabilidade ➡](11-matriz-de-rastreabilidade.md)
