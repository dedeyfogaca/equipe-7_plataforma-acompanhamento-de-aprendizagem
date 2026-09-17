# 05 · Escopo

> **Vértice** — Plataforma de Acompanhamento de Aprendizagem
> Documento de Visão e Requisitos · Imersão Profissional: Projeto de Software · ADSIS4S · Entrega 2 (revisão da Entrega 1)

---

## Incluído na primeira versão

**Estrutura do grupo**

- Criação, seleção e exclusão de grupos de estudo
- Cadastro, edição e exclusão de membros do grupo
- Cadastro, edição e exclusão de disciplinas
- Cadastro, edição e exclusão de conteúdos vinculados a uma disciplina

**Atividades**

- Cadastro, edição e exclusão de atividades com título, descrição, conteúdo, prazo, peso, prioridade, status e responsável
- Listagem de atividades com busca por texto, filtros por status, responsável, disciplina e prazo, e ordenação
- Página de detalhe da atividade com alteração rápida de status
- Sinalização de prazos que coincidem com feriados nacionais ou com fim de semana

**Acompanhamento e desempenho**

- Painel com totais por status, atividades atrasadas, próximas entregas e próximos feriados nacionais
- Cálculo e exibição do progresso por conteúdo e por disciplina
- Registro e visualização do histórico de progresso ao longo do tempo
- Pontos de experiência atribuídos por atividade concluída, proporcionais ao peso
- Ofensiva de dias consecutivos com pelo menos uma atividade concluída
- Conquistas concedidas ao atingir marcos de progresso e de constância
- Painel de desempenho do grupo com experiência, ofensiva e conquistas por integrante

**Interface**

- Tema claro e escuro
- Avatar por membro, sorteado e trocável
- Carga de dados de exemplo para conhecer o sistema sem cadastrar nada

---

## Não incluído nesta versão

- Banco de questões, simulados e correção objetiva
- Ranking competitivo entre grupos ou entre instituições
- Notificações por e-mail ou push
- Aplicativo móvel nativo
- Exportação de relatórios em PDF ou planilha
- Integração com sistemas acadêmicos institucionais
- Autenticação por senha e recuperação de acesso

---

## Restrições

| Tipo | Restrição |
|---|---|
| **Prazo** | O desenvolvimento está limitado ao período do bimestre, encerrando-se em 25/09/2026 |
| **Equipe** | Dois integrantes, ambos conciliando o projeto com as demais disciplinas do curso |
| **Tecnologia** | Interface em React 18 com Vite |
| **Persistência** | Nesta versão os dados são armazenados no navegador do usuário, seguindo a estrutura definida no modelo lógico do banco de dados. Isso restringe o acesso ao dispositivo utilizado e impede o compartilhamento automático entre integrantes |
| **Acesso** | O acesso ocorre pela seleção do grupo, sem autenticação por senha; a identificação do perfil depende da escolha do próprio usuário |
| **Integração** | O sistema depende de três serviços externos gratuitos, todos sujeitos a indisponibilidade: **BrasilAPI** e **Nager.Date** para os feriados nacionais, e **DiceBear** para as imagens de avatar. A tipografia é servida pelo **Google Fonts**. Nenhum deles tem contrato de nível de serviço, e por isso cada um tem alternativa local prevista (RNF10, RN15, RN17) |

---

### Navegação

[⬅ Anterior: Público-Alvo e Perfis do Usuário](04-publico-alvo-e-perfis-do-usuario.md) · [Índice](../README.md) · [Próximo: Requisitos Funcionais ➡](06-requisitos-funcionais.md)
