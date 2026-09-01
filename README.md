<div align="center">

# VÉRTICE

### Plataforma de Acompanhamento de Aprendizagem

`Imersão Profissional: Projeto de Software` · `ADSIS4S` · `Equipe 7`

</div>

---

## Sobre o projeto

O Vértice é uma plataforma web para grupos de estudo organizarem suas disciplinas, conteúdos e atividades em um único ambiente e acompanharem, de forma visual, o quanto já avançaram.

**O problema.** Estudantes acompanham várias disciplinas ao mesmo tempo e organizam esse trabalho de forma dispersa: conversas, cadernos, planilhas improvisadas. Isso custa prazos e responsabilidades perdidas, mas o problema maior é outro — o estudante vê o que falta fazer e não vê o quanto já avançou. Uma lista de tarefas informa que restam cinco itens; ela não informa que ele já cobriu 70% de uma disciplina e quase nada de outra.

**O objetivo.** Desenvolver uma plataforma web que permita a grupos de estudo organizarem suas atividades acadêmicas e acompanharem visualmente a evolução do progresso em cada disciplina e conteúdo.

**A solução.** Cada atividade é ancorada em um conteúdo, que pertence a uma disciplina. Concluir uma atividade alimenta o percentual de progresso do conteúdo, que compõe o da disciplina, credita experiência ao responsável, alimenta a ofensiva de dias consecutivos e pode desbloquear conquistas. O registro de execução vira medida de aprendizagem.

---

## Equipe

| Integrante | GitHub |
|---|---|
| Andrey Fogaça | [@dedeyfogaca](https://github.com/dedeyfogaca) |
| Matheus Saraiva Faustin | [@MatheusSaraiv-a](https://github.com/MatheusSaraiv-a) |

---

## Principais funcionalidades

- Criação e seleção de grupos de estudo, com cadastro de membros e perfis de permissão
- Cadastro de disciplinas e de conteúdos vinculados a elas
- Cadastro de atividades com conteúdo, prazo, peso, prioridade, status e responsável
- Listagem com busca, filtros por status, responsável, disciplina e prazo, e ordenação
- Painel com totais por status, atividades atrasadas e próximas entregas
- Barra de progresso por conteúdo e por disciplina, calculada a partir do peso das atividades concluídas
- Histórico de progresso ao longo do tempo
- Experiência por atividade concluída, ofensiva de dias consecutivos e conquistas por marcos
- Painel de desempenho com experiência, ofensiva e conquistas de cada integrante
- Sinalização de prazos que caem em feriado nacional
- Tema claro e escuro

---

## Tecnologias previstas

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Interface | React 18 com Vite | Stack que a equipe já domina; o Vite dá build rápido e configuração mínima |
| Roteamento | React Router | Rotas públicas, privadas e dinâmicas sem biblioteca adicional |
| Estilo | Styled Components | Permite manter um design system próprio com tema claro e escuro no mesmo código |
| Estado | Context API | Suficiente para o volume de dados do projeto, sem dependência externa |
| Persistência | Armazenamento do navegador, seguindo o modelo lógico relacional | Elimina a necessidade de servidor no prazo do bimestre; a migração para MySQL exige apenas trocar a camada de acesso |
| Integração | BrasilAPI | Fonte pública e gratuita para os feriados nacionais |

---

## Estrutura do repositório

```
.
├── docs/               Documento de Visão e Requisitos, casos de uso e rastreabilidade
├── diagramas/          Casos de uso, classes e fluxos de processo
│   └── png/            Versões em imagem dos diagramas
├── banco-de-dados/     Modelo conceitual, modelo lógico, dicionário e script SQL
├── prototipos/         Mapa de navegação e telas
└── src/                Código-fonte da aplicação
```

---

## Documentação

### Documento de Visão e Requisitos

| # | Documento | Conteúdo |
|---|---|---|
| 01 | [Identificação do Projeto](docs/01-identificacao-do-projeto.md) | Dados da equipe e descrição geral do sistema |
| 02 | [Contexto e Problema](docs/02-contexto-e-problema.md) | Situação atual, problema, quem enfrenta e justificativa |
| 03 | [Objetivos](docs/03-objetivos.md) | Objetivo geral e objetivos específicos |
| 04 | [Público-Alvo e Perfis do Usuário](docs/04-publico-alvo-e-perfis-do-usuario.md) | Estudante organizador e estudante participante |
| 05 | [Escopo](docs/05-escopo.md) | Incluído, não incluído e restrições |
| 06 | [Requisitos Funcionais](docs/06-requisitos-funcionais.md) | RF01 a RF18 |
| 07 | [Requisitos Não Funcionais](docs/07-requisitos-nao-funcionais.md) | RNF01 a RNF09 |
| 08 | [Regras de Negócio](docs/08-regras-de-negocio.md) | RN01 a RN14 |
| 09 | [Histórico de Alterações](docs/09-historico-de-alteracoes.md) | Mudanças entre a Entrega 1 e a Entrega 2 |
| 10 | [Especificação dos Casos de Uso](docs/10-casos-de-uso.md) | UC01, UC03, UC05, UC07, UC08 e UC09 detalhados |
| 11 | [Matriz de Rastreabilidade](docs/11-matriz-de-rastreabilidade.md) | Requisito → caso de uso → entidades → tela |

### Modelagem do software

| Diagrama | Conteúdo |
|---|---|
| [Identidade visual](diagramas/00-identidade-visual.md) | Paleta, tipografia e vocabulário de formas usados nos diagramas |
| [Casos de uso](diagramas/01-casos-de-uso.md) | Atores, fronteira do sistema e os onze casos de uso |
| [Classes](diagramas/02-classes.md) | Oito classes com atributos, operações e cardinalidades |
| [Fluxo — Concluir atividade](diagramas/03-atividade-concluir.md) | Recálculo de progresso, experiência, ofensiva e conquistas |
| [Fluxo — Cadastrar atividade](diagramas/04-atividade-cadastrar.md) | Vínculo com disciplina e conteúdo, validações e padrões |

### Modelagem do banco de dados

| Documento | Conteúdo |
|---|---|
| [Modelo conceitual](banco-de-dados/01-modelo-conceitual.md) | Entidades, atributos, relacionamentos e cardinalidades |
| [Modelo lógico](banco-de-dados/02-modelo-logico.md) | Tabelas, chaves primárias e estrangeiras, tipos e restrições |
| [Dicionário de dados](banco-de-dados/03-dicionario-de-dados.md) | Descrição campo a campo das oito tabelas |
| [Script de criação](banco-de-dados/04-script-criacao.sql) | DDL em MySQL 8, carga inicial e consultas de referência |

---

## Como rodar

Requisitos: Node.js 18 ou superior e npm.

```bash
cd src
npm install
npm run dev
```

O terminal exibirá o endereço local, normalmente `http://localhost:5173`. Na tela de acesso, use "Carregar dados de exemplo" para entrar com um grupo já preenchido.

```bash
npm run build     # gera a versão de produção
npm run preview   # pré-visualiza a versão de produção
```

---

## Entregas do bimestre

| Entrega | Data | Conteúdo |
|---|---|---|
| 1 | 14/08/2026 | Documento de Visão e Requisitos |
| 2 | 08/09/2026 | Documento revisado, modelagem do software e modelagem do banco de dados |
| 3 | 25/09/2026 | Repositório organizado, protótipos e definição do MVP |
