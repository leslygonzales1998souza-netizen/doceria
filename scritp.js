// 1. Cria uma função para atualizar o número que aparece lá no topo da página
function atualizarNumeroDoCarrinho() {
    // Pega o botão do carrinho do topo da tela
    const botaoCarrinho = document.getElementById("btn-carrinho");
    if (!botaoCarrinho) return; // Segurança caso o botão não exista nesta página
    
    // Pega os doces salvos na memória do navegador. Se não tiver nenhum, começa com uma lista vazia []
    const itensSalvos = JSON.parse(localStorage.getItem("carrinho_atual")) || [];
    
    // 👉 OTIMIZADO: Conta quantos doces totais foram adicionados usando .reduce()
    const totalDoces = itensSalvos.reduce((acumulador, item) => acumulador + item.quantidade, 0);
    
    // 👉 OTIMIZADO: Muda o texto do botão usando Template Literals (Crasis)
    botaoCarrinho.textContent = `Carrinho (${totalDoces})`;
}

// 2. Procura todos os botões "Adicionar" que existem na página (Atualizado para const)
const botoesAdicionar = document.querySelectorAll(".btn-adicionar-card");

// 3. 👉 OTIMIZADO: Para cada botão encontrado, usa .forEach() em vez do laço "for" convencional
botoesAdicionar.forEach((botao) => {
    
    botao.addEventListener("click", (evento) => {
        // Descobre qual foi o botão exato que o usuário clicou
        const botaoClicado = evento.target;
        
        // Sobe até a caixinha (card) que guarda as informações desse doce específico
        const caixinhaDoDoce = botaoClicado.closest(".card-doce");
        if (!caixinhaDoDoce) return;

        // Pega o nome, preço e a quantidade que o usuário digitou no campo
        const nomeDoDoce = caixinhaDoDoce.getAttribute("data-nome");
        const precoDoDoce = parseFloat(caixinhaDoDoce.getAttribute("data-preco"));
        const campoQuantidade = caixinhaDoDoce.querySelector(".qtd-produto-vitrine");
        const quantidadeEscolhida = parseInt(campoQuantidade.value) || 1;

        // Pega a lista de doces que já estava na memória do navegador
        const listaDoCarrinho = JSON.parse(localStorage.getItem("carrinho_atual")) || [];

        // 👉 OTIMIZADO: Busca se o doce já foi adicionado antes usando o método .find()
        const itemExistente = listaDoCarrinho.find(item => item.nome === nomeDoDoce);

        if (itemExistente) {
            // Se o doce já estava lá, só soma a nova quantidade diretamente no objeto encontrado
            itemExistente.quantidade += quantidadeEscolhida;
        } else {
            // Se o doce não estava no carrinho ainda, cria e adiciona ele na lista
            const novoItem = {
                nome: nomeDoDoce,
                preco: precoDoDoce,
                quantidade: quantidadeEscolhida
            };
            listaDoCarrinho.push(novoItem);
        }

        // Salva a lista atualizada de volta na memória do navegador (LocalStorage)
        localStorage.setItem("carrinho_atual", JSON.stringify(listaDoCarrinho));

        // Atualiza o contador de itens lá no topo da página
        atualizarNumeroDoCarrinho();

        // Mostra um aviso rápido no botão dizendo que deu certo
        botaoClicado.textContent = "Adicionado! ✓";
        setTimeout(() => {
            botaoClicado.textContent = "Adicionar";
            campoQuantidade.value = 1; // Reseta o seletor para 1
        }, 1000);
    });
});

// 4. Assim que a página abre, roda essa função para o carrinho não começar em zero se já tiver itens salvos
atualizarNumeroDoCarrinho();
