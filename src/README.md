# Vértice

Plataforma de acompanhamento de aprendizagem.

O Vértice **mede o quanto o estudante avançou em cada disciplina**. Não é um
gerenciador de tarefas: toda atividade tem um **peso de 1 a 5**, e o progresso
é a razão entre o peso concluído e o peso total. Concluir uma atividade não
risca um item de uma lista — move uma barra e credita experiência a quem a fez.

Quem entra no sistema entra como um **grupo**. O grupo organiza suas
disciplinas, divide cada uma em conteúdos e pendura as atividades nos
conteúdos. Tudo fica salvo no navegador, então recarregar a página não perde
nada.

> Projeto de front-end em **React + Vite** e **Styled Components**, sem
> servidor.

---

## A hierarquia

Essa cadeia é a espinha do sistema, e o que permite medir progresso:

```
grupo ──▶ disciplina ──▶ conteúdo ──▶ atividade (peso 1–5)
```

Uma atividade pertence a **exatamente um** conteúdo, e um conteúdo a
**exatamente uma** disciplina. Não existe atividade solta.

O progresso sobe por essa cadeia somando peso:

- **progresso do conteúdo** = peso das atividades concluídas ÷ peso de todas
- **progresso da disciplina** = peso concluído de todos os conteúdos ÷ peso
  total de todos os conteúdos

A segunda linha **não é a média dos percentuais dos conteúdos**. Um conteúdo
que vale 20 pontos de peso pesa mais que um de 4, e a média trataria os dois
como iguais. Conteúdo sem atividade nenhuma fica **fora** do cálculo, em vez de
contar como 0%.

**Experiência:** cada ponto de peso vale 10 de experiência, creditada ao
responsável quando a atividade é concluída e estornada se ela deixar de estar.
Atividade sem responsável não gera experiência, e isso é normal.

---

## Funcionalidades

- **Acesso em dois passos, sem senha**: primeiro o grupo, depois quem você é
  dentro dele. Os dois são seleção — não há senha nem servidor.
- **Disciplinas** por grupo, cada uma com uma cor para reconhecer de relance.
  Nome único dentro do grupo.
- **Conteúdos** dentro de cada disciplina, em ordem definida pelo grupo.
- **Atividades** com título, descrição, prazo, peso, prioridade, status e
  responsável (opcional).
- **Progresso** por conteúdo e por disciplina, calculado por peso.
- **Experiência** acumulada por membro, derivada das atividades concluídas.
- **Membros** do grupo, com avatar sorteado e perfil. O **organizador**
  gerencia membros, disciplinas, conteúdos e exclui o grupo; o
  **participante** cadastra e edita atividades.
- **Filtros e busca** na lista de atividades: por status, responsável, prazo,
  além de busca por título, disciplina ou conteúdo, e ordenação.
- **Painel** com contagem por situação, atrasadas, próximas entregas e
  próximos feriados.
- **Prazos por cor**: verde (tranquilo), amarelo (está perto), vermelho (muito
  perto ou atrasada).
- **Feriados** da BrasilAPI, avisando quando um prazo cai em feriado nacional.
- **Tema claro e escuro**, com a escolha salva.
- **Migração automática** dos dados de quem usou a versão anterior.
- **Página 404** e layout responsivo.

---

## Tecnologias

| Camada | Ferramenta |
|--------|-----------|
| Biblioteca de UI | React 18 |
| Build / servidor de desenvolvimento | Vite |
| Estilização | Styled Components + design system próprio |
| Tipografia | Manrope, em pesos variados; JetBrains Mono apenas para números |
| Navegação | React Router (rotas normais, dinâmicas e privadas) |
| Estado | Context API + hooks |
| Persistência | armazenamento do navegador |
| API externa | [BrasilAPI](https://brasilapi.com.br/) e [Nager.Date](https://date.nager.at/) (feriados) |
| Avatares | [DiceBear](https://www.dicebear.com/), estilo Croodles Neutral |

---

## Como rodar

Pré-requisitos: **Node.js 18+** e npm.

```bash
npm install     # instalar dependências
npm run dev     # rodar em desenvolvimento
npm run build   # gerar a versão de produção
npm run preview # pré-visualizar a produção
npm run verificar # conferir as regras de cálculo
```

> Na primeira tela, clique em **"Carregar dados de exemplo"** para entrar com
> um grupo preenchido e conhecer o sistema.

O `npm run verificar` roda as verificações de `verificacoes/`, em JavaScript
puro, sem dependência de teste instalada. Elas existem porque as regras de
progresso e de experiência têm duas armadilhas fáceis: trocar a razão de pesos
pela média dos percentuais, e creditar experiência duas vezes ao concluir,
desmarcar e concluir de novo.

---

## Estrutura do projeto

```
src/
├── main.jsx                  # Ponto de entrada; roda a migração antes de montar
├── App.jsx                   # Mapa de rotas
├── styles/
│   ├── theme.js              # Tokens dos temas escuro e claro
│   └── GlobalStyle.js        # Reset + estilos base
├── lib/
│   ├── storage.js            # Armazenamento do navegador + geração de id
│   ├── constants.js          # Status, prioridade, peso, perfil, cores
│   ├── datas.js              # Formatação e cálculo de prazos
│   ├── validacao.js          # Validações em JS puro
│   ├── progresso.js          # Progresso de conteúdo e de disciplina
│   ├── gamificacao.js        # Experiência
│   ├── migracao.js           # Migração dos dados do formato antigo
│   ├── avatar.js             # URL da DiceBear + iniciais
│   ├── feriados.js           # BrasilAPI → Nager.Date → cache
│   └── seed.js               # Dados de exemplo
├── hooks/
│   └── useFeriados.js
├── context/
│   ├── TemaContext.jsx       # Tema claro/escuro
│   ├── DataContext.jsx       # Coleções + CRUD + seletores
│   └── AuthContext.jsx       # Sessão (grupo ativo)
├── routes/
│   └── ProtectedRoute.jsx
├── components/
│   ├── ui/                   # Design system (Button, Card, BarraProgresso...)
│   ├── layout/               # Casca das páginas privadas
│   ├── AtividadeCard.jsx     # Card de atividade
│   ├── AnelPeso.jsx          # Anel de 5 segmentos do peso
│   ├── SeloXp.jsx            # Selo de experiência
│   ├── Badges.jsx            # Selos de status e prioridade
│   ├── BotaoTema.jsx
│   ├── LogoVertice.jsx
│   ├── IconeLixeira.jsx
│   └── Rodape.jsx
└── pages/
    ├── Login.jsx
    ├── Painel.jsx
    ├── Disciplinas.jsx
    ├── DisciplinaDetalhe.jsx # Conteúdos da disciplina + progresso
    ├── Atividades.jsx
    ├── AtividadeForm.jsx     # Criar e editar (mesmo componente)
    ├── AtividadeDetalhe.jsx
    ├── Membros.jsx
    └── NotFound.jsx

verificacoes/                 # Verificação das regras de cálculo
├── progresso.js
└── gamificacao.js
```

---

## Modelo de dados

As coleções do navegador guardam **as mesmas chaves e vínculos** do modelo
relacional entregue. Isso é proposital: migrar para MySQL troca a camada de
acesso, não remodela dados.

Chaves: `grupos`, `membros`, `disciplinas`, `conteudos`, `atividades`,
`sessao`, `versaoDados`.

A `sessao` guarda o grupo e o membro que está usando o sistema. Ela não vem
do modelo relacional: é estado do navegador, e existe porque o perfil do RN07
precisa saber quem é a pessoa.

| Entidade | Campos |
|---|---|
| **grupo** | `id`, `nome`, `descricao`, `criadoEm` |
| **membro** | `id`, `grupoId`, `nome`, `funcao`, `email`, `avatar`, `perfil` |
| **disciplina** | `id`, `grupoId`, `nome`, `cor`, `criadaEm` — nome único no grupo |
| **conteudo** | `id`, `disciplinaId`, `nome`, `descricao`, `ordem` — nome único na disciplina |
| **atividade** | `id`, `conteudoId`, `responsavelId`, `titulo`, `descricao`, `prazo`, `peso`, `prioridade`, `status`, `criadaEm`, `dataConclusao` |

Repare que **a atividade não guarda `grupoId`**: o grupo chega pela cadeia
`atividade → conteudo → disciplina → grupo`. Guardá-lo ali seria um dado
derivado com prazo de validade. Todo seletor filtra por grupo atravessando essa
cadeia, e por isso cada grupo só enxerga o que é dele.

O `status` é gravado como `'a fazer'`, `'fazendo'` ou `'concluido'`.

### Exclusão em cascata

- Grupo excluído remove disciplinas, conteúdos, atividades e membros.
- Disciplina excluída remove seus conteúdos e as atividades deles.
- Conteúdo excluído remove suas atividades.
- **Membro excluído não remove atividades** — elas ficam sem responsável.

### Migração

Quem usou a versão anterior tinha as atividades gravadas como `tarefas`, com a
disciplina em texto livre. Ao abrir o sistema, a migração roda **uma vez**, com
marcador de versão gravado, e converte esses dados: cria uma disciplina por
nome distinto, um conteúdo "Geral" em cada uma para receber as atividades,
atribui peso 1, preenche a data de conclusão das já concluídas e define o
perfil dos membros. A chave antiga só é apagada depois de a nova estar gravada.

---

## Rotas

| Rota | Tela | Acesso |
|------|------|--------|
| `/login` | Acesso ao grupo | pública |
| `/` e `/painel` | Painel | privada |
| `/disciplinas` | Disciplinas do grupo | privada |
| `/disciplina/:id` | Conteúdos da disciplina e progresso | privada |
| `/atividades` | Lista de atividades com filtros | privada |
| `/atividade/nova` | Formulário de nova atividade | privada |
| `/atividade/:id` | Detalhe da atividade | privada |
| `/atividade/:id/editar` | Formulário de edição | privada |
| `/membros` | Membros do grupo | privada |
| `*` | Página 404 | pública |

As rotas privadas só abrem com um grupo na sessão; sem ela, o sistema manda
para `/login`.

---

## Mapeamento dos requisitos

| Requisito | Onde se resolve |
|-----------|-----------------|
| HTML5 semântico | `header`, `nav`, `main`, `section`, `article`, `aside`, `dl`, `ol` nas telas |
| Box Model | Cards de atividade e blocos do painel |
| Flexbox | Header, barra de filtros, rodapés dos cards |
| Grid | Painel e grade da lista de atividades |
| Media Queries | Header vira menu, grades viram coluna única |
| Styled Components | Toda a estilização + design system em `components/ui` |
| Componentização | Button, Card, Badge, Field, Avatar, Modal, BarraProgresso, AnelPeso |
| Validação em JS puro | `lib/validacao.js` |
| Eventos e listeners | Submits, filtros, troca de status, reordenar conteúdo, fechar modal no Esc |
| Armazenamento do navegador | `lib/storage.js` + `DataContext` |
| Fetch API + JSON | `lib/feriados.js` (BrasilAPI e Nager.Date) |
| Props | A lista passa cada atividade ao `AtividadeCard` |
| useState | Formulários, filtros, coleções |
| useEffect | Persistência e busca dos feriados |
| React Router | Rotas normais, dinâmicas (`/atividade/:id`) e privadas |
| Regras de negócio fora das telas | `lib/progresso.js`, `lib/gamificacao.js`, `lib/validacao.js`, `lib/datas.js` |

---

## Observações

- **Sem servidor.** É tudo front-end. Não há senha: o acesso é a seleção de um
  grupo guardado no navegador.
- **Serviços externos não derrubam a tela.** Os feriados seguem a cadeia
  BrasilAPI → Nager.Date → último resultado em cache, e omitem em silêncio se
  tudo falhar. O avatar cai para as iniciais do nome quando a imagem não
  carrega. Nenhum desses serviços recebe dado do grupo.
- **O perfil restringe, mas não protege.** O organizador é quem gerencia
  membros, disciplinas, conteúdos e exclui o grupo, e os controles somem para
  quem é participante. Isso organiza o grupo; não é segurança — sem servidor e
  sem senha, quem quiser troca o próprio perfil. O que a regra evita é a
  bagunça acidental, que é o problema real de um trabalho em grupo.
- **O grupo não fica sem organizador.** O último não pode ser rebaixado nem
  removido: sem ele ninguém mais gerencia nada e o grupo trava.
