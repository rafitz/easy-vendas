# Easy Vendas

**A loja da esquina no bolso de cada cliente.**

Protótipo web da Easy Vendas, o shopping digital do comércio local de São Sebastião do Paraíso (MG). O cliente encontra produtos disponíveis em lojas físicas perto dele, monta o carrinho e escolhe entre retirar na loja ou receber em casa. Cada loja recebe e cuida do seu próprio pedido.

Todos os dados são fictícios e ficam no próprio navegador. Não existe servidor, banco de dados nem pagamento real.

## Como abrir

Não precisa instalar nada. Há duas formas:

- **Abrir direto:** dê dois cliques em `index.html`.
- **Com um servidor local** (recomendado, para o comportamento ficar igual ao de um site publicado):

  ```bash
  python3 -m http.server 8000
  ```

  Depois abra http://localhost:8000 no navegador.

O layout foi pensado primeiro para o celular. Para ver como no aparelho, use o modo de celular das ferramentas de desenvolvedor do navegador.

## O que dá para fazer

### Cliente

- **Buscar** produtos ou lojas. A busca entende pequenos erros de digitação ("tenus" encontra "tênis") e mostra sugestões enquanto a pessoa digita.
- **Filtrar** por distância, disponibilidade, promoção, preço, categoria e marca, e **ordenar** por proximidade, preço ou procura.
- **Ver o produto** com tamanho, cor, quantidade, distância até a loja e comparação de preço com outras lojas.
- **Adicionar ao carrinho.** Produtos sem variação entram direto pelo botão "Adicionar" dos cards.
- **Carrinho separado por loja.** Cada loja vira um pedido próprio, com:
  - retirada na loja (grátis) ou entrega em casa (taxa e prazo de cada loja);
  - subtotal, entrega e total;
  - o botão "Finalizar pedido nesta loja".
- **Finalizar o pedido** com nome, telefone, e-mail opcional e forma de pagamento (pagar na loja, Pix ou cartão, todos simulados).
- **Acompanhar em Meus pedidos**, com o andamento passo a passo e o atalho para chamar a loja no WhatsApp (conversa simulada).
- **Ofertas** com desconto em destaque, validade e aviso de últimas unidades.
- **Perfil** com login simulado, a opção "Aumentar texto" e a escolha da cidade.

### Lojista

- **Cadastro da loja em 4 passos:** nome e tipo, endereço pelo CEP, WhatsApp e horário, e o primeiro produto.
- **Visão geral** com "O que fazer hoje" e os números da semana.
- **Produtos:** cadastro rápido (foto, nome, preço e estoque), edição, duplicar e pausar.
- **Pedidos:** confirmar, preparar, avisar que está pronto ou que saiu para entrega, concluir ou cancelar.
- **Promoções**, **Minha loja**, **Estatísticas** e **Configurações**, incluindo a taxa de entrega.

## Roteiro rápido para apresentar

1. Na **Início**, toque em **Calçados** e abra o **Nike Court Vision Low**.
2. Escolha tamanho e cor e toque em **Adicionar ao carrinho**.
3. Na **Busca**, adicione a **Bola de Futebol Penalty** (Sport Center) e o **Perfume Malbec** (Essência Perfumaria).
4. Abra o **Carrinho**: os produtos aparecem em dois pedidos, um por loja.
5. Na Sport Center, escolha **Receber em casa** e toque em **Finalizar pedido nesta loja**.
6. Preencha nome e telefone e toque em **Confirmar pedido**.
7. Toque em **Sou lojista** (ou vá em Perfil › Painel do lojista), abra **Pedidos** e avance o status do pedido.
8. Volte para **Perfil › Meus pedidos**: o andamento já aparece atualizado.

## Estrutura dos arquivos

```
easy-vendas/
├── index.html          Página única que carrega estilos e scripts
├── assets/
│   └── logo.png        Logo da Easy Vendas
├── css/
│   └── styles.css      Todo o visual: cores, tipografia, componentes e telas
└── js/                 Carregados nesta ordem pelo index.html
    ├── icons.js        Ícones em SVG e a logo
    ├── data.js         Lojas, produtos e categorias fictícios
    ├── core.js         Estado, utilidades, busca, navegação, topo e menu inferior
    ├── consumidor.js   Telas do cliente: início, busca, produto, loja, ofertas, perfil e login
    ├── cadastro.js     Cadastro do lojista em 4 passos
    ├── carrinho.js     Carrinho por loja, finalização e Meus pedidos
    ├── modais.js       Janelas: WhatsApp simulado, como chegar e localização
    ├── painel.js       Painel do lojista
    └── app.js          Avisos, ações dos botões, eventos e inicialização
```

Os scripts são JavaScript puro, sem bibliotecas e sem etapa de build. Eles compartilham variáveis globais, por isso a ordem de carregamento no `index.html` importa.

## Dados e limites do protótipo

- **10 lojas e 34 produtos fictícios** de São Sebastião do Paraíso. Estão em `js/data.js` e são fáceis de editar.
- **Pagamento, entrega e WhatsApp são simulados.** Nenhum valor é cobrado e nenhuma mensagem é enviada.
- **Carrinho, pedidos e mudanças de status ficam só na memória.** Ao recarregar a página, tudo volta aos dados de exemplo. Só a opção "Aumentar texto" fica salva no navegador.
- **O painel do lojista mostra a Sport Center** como loja de exemplo, mesmo depois de cadastrar uma loja nova.
- Fora do escopo desta versão: gateway de pagamento, nota fiscal, entregadores, rastreamento e programa de fidelidade.

## Identidade visual

- Azul Easy Vendas `#1261D6`, azul-marinho `#14233F`, branco e cinza claro `#F5F7FA`.
- Títulos em Poppins e textos em Inter, carregadas do Google Fonts.
- Tema sempre claro, para a logo ficar legível.
- Textos e botões grandes, alto contraste e poucas ações por tela, pensando também no público mais velho.
