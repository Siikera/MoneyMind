# 💰 MoneyMind - Feito por Mateus Tomaz Siqueira e Victor Junio Grigoleto Chicas
## 🏗️  Este Sistema esta sendo programado em  ☕ Java com Spring e 🎨 Angular.

O **MoneyMind** é um sistema de gerenciamento financeiro pessoal desenvolvido para ajudar usuários a organizar suas contas, controlar receitas e despesas, planejar metas financeiras e acompanhar o fluxo de dinheiro de forma prática e eficiente.  

  ## 🗂️ Diagrama UML

![Diagrama](Imagens/Diagrama.jpg)

## 📌 Funcionalidades principais  
- **Usuário**: cadastro de informações pessoais e autenticação de email e senha; 
- **Conta**: suporte a diferentes tipos de contas (corrente, poupança, cartão de crédito, investimento, etc.), com saldo e limite configuráveis.  
- **Banco**: associação de contas a instituições financeiras.  
- **Fluxo Financeiro**: registro de operações de crédito e débito, com valores, datas, parcelas, situação (aberto/quitado) e vínculo a centros de custo.  
- **Meta Financeira**: criação e acompanhamento de objetivos financeiros com prazo, valor e status (em andamento/conquistada).  
- **Centro de Custo**: categorização de receitas e despesas para melhor análise financeira.  
- **Pessoa**: associação de operações financeiras a pessoas ou entidades externas.  

## 📊 Estrutura do Projeto  
- **Entidades principais**:  
  - `Usuario`  
  - `Conta`  
  - `Banco`  
  - `FluxoFinanceiro`  
  - `MetaFinanceira`  
  - `CentroCusto`  
  - `Pessoa`  

- **Enumerations**:  
  - `TipoConta` → Conta Corrente, Investimento, Cartão de Crédito, Alimentação, Poupança.  
  - `TipoOperacao` → Crédito, Débito.  
  - `Situacao` → Aberto, Quitado.  
  - `StatusMeta` → Em Andamento, Conquistada.



## 🚀 Objetivo  
O objetivo do **MoneyMind** é fornecer uma ferramenta completa e organizada para auxiliar na **educação financeira**, permitindo que o usuário:  
- Tenha controle sobre suas movimentações financeiras.  
- Planeje metas de curto, médio e longo prazo.  
- Acompanhe seus gastos por categoria e instituição bancária.
- Emissão de relatório mensal compeleta.
