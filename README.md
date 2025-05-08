# 🎬 Cinedrome

## 📋 Sobre o Projeto

Cinedrome é uma aplicação web em desenvolvimento que permite ao usuário visualizar e gerenciar sua coleção de filmes assistidos. O sistema importa dados de filmes do Letterboxd via RSS e os complementa com informações detalhadas da API do TMDb, criando uma experiência rica para cinéfilos.

### ✨ Funcionalidades Principais

- Visualização de filmes assistidos em uma interface intuitiva e moderna;
- Detalhes completos de cada filme incluindo sinopse, elenco, gênero e mais;
- Integração com Letterboxd para importação de histórico de filmes;
- Enriquecimento automático com dados da API do TMDb;
- Design responsivo para acesso em qualquer dispositivo.

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React**: Biblioteca JavaScript para construção de interfaces;
- **Material-UI**: Framework de componentes para design moderno;
- **Framer Motion**: Biblioteca para animações fluidas;
- **React Router**: Gerenciamento de rotas na aplicação.

### Backend

- **Go (Golang)**: Linguagem de programação de alto desempenho;
- **Gin**: Framework web para Go com foco em API REST;
- **PostgreSQL**: Banco de dados relacional para armazenamento das informações pertencentes a aplicação;
- **TMDb API**: Integração com The Movie Database para informações complementares dos filmes.

## Arquitetura

O Cinedrome implementa uma arquitetura moderna de separação de responsabilidades:

- **Backend**: Uma API REST desenvolvida em Go com Gin, organizada em camadas bem definidas:

  - Handlers para processamento de requisições HTTP;
  - Services para encapsulamento da lógica de negócios;
  - Repositories para abstração do acesso a dados;
  - Esta estrutura garante alta manutenibilidade e testabilidade do código.

- **Frontend**: Uma SPA (Single Page Application) React que prioriza experiência do usuário:
  - Componentes reutilizáveis com Material-UI para consistência visual;
  - Animações fluidas com Framer Motion para feedback visual e microinterações;
  - Gerenciamento de estado otimizado para performance;
  - Design responsivo pensado para diversos dispositivos.

## 🎯 Destaques de Implementação

- **Arquitetura em Camadas**: Implementei uma estrutura clara de separação de responsabilidades no backend seguindo o padrão Repository-Service-Handler, o que não apenas melhora a manutenibilidade do código, mas também facilita a escrita de testes unitários isolados para cada camada. Essa abordagem também permitiu centralizar a lógica de tratamento de erros e conexão com APIs externas;

- **Design Responsivo e Adaptativo**: A interface foi construída com o conceito de "mobile-first", garantindo uma experiência fluida em dispositivos desde smartphones até desktops de alta resolução. Utilizei breakpoints estratégicos e unidades relativas (rem, vh/vw) para criar um layout que se adapta organicamente a diferentes tamanhos de tela;

- **Animações Contextuais**: Implementei animações com Framer Motion não apenas para estética, mas como elementos funcionais que melhoram a usabilidade. As transições de página e componentes fornecem feedback visual sobre interações e estados do sistema, criando uma experiência mais intuitiva para o usuário;

- **Sistema Robusto de Tratamento de Erros**: Desenvolvi um mecanismo centralizado de tratamento de erros que captura falhas tanto em chamadas de API quanto em processamento interno, traduzindo-as em mensagens amigáveis para o usuário. Erros no backend são categorizados e logados para facilitar debugs e monitoramento;

- **Otimização de Performance**: Implementei carregamento assíncrono e lazy loading de componentes e dados, junto com técnicas como memoização de componentes React e caching estratégico de respostas de API, resultando em uma experiência responsiva mesmo ao lidar com grandes conjuntos de dados de filmes.

## 🚀 Roadmap de Desenvolvimento

### 🌟 Sistema de Curadoria de Críticos

Planejo implementar uma funcionalidade que permitirá aos usuários:

- Acompanhar críticos e usuários do Letterboxd de sua escolha;
- Ver rapidamente opiniões diferentes sobre cada filme;
- Descobrir recomendações baseadas em críticos com gostos similares.

### Outras Melhorias Planejadas

1. **Autenticação de Usuários**

   - Login e perfis personalizados;
   - Sincronização com conta do Letterboxd sem necessidade de atualização do RSS.

2. **Estatísticas e Visualizações**
   - Gráficos de gêneros assistidos;
   - Tendências de avaliação ao longo do tempo.

## 📸 Screenshots

![Tela inicial](https://i.imgur.com/4fGrQOi.png)
_Tela inicial mostrando a lista de filmes assistidos_

![Capa do componente de detalhes do filme](https://i.imgur.com/R7tBSON.png)
_A página específica do filme sempre será encabeçada por uma imagem de divulgação do filme_

![Detalhes do filme](https://i.imgur.com/l17JSPc.png)
_Bloco de detalhes do filme selecionado_

![Detalhes do filme](https://i.imgur.com/tjsupEh.png)
_Bloco de detalhes do filme selecionado_