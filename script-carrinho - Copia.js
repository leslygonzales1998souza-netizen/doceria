// 1. MAPEAMENTO DOS ELEMENTOS DO HTML (Padronizado para const)
const espacoDosItens = document.getElementById("itens-carrinho");
const textoPrecoTotal = document.getElementById("preco-total-carrinho");
const seletorEntrega = document.getElementById("entrega-metodo");
const caixinhaEndereco = document.getElementById("grupo-endereco");
const campoEnderecoInput = document.getElementById("cliente-endereco");
const botaoFinalizar = document.getElementById("btn-finalizar-pedido");

// 2. FUNÇÃO QUE LÊ A MEMÓRIA E MOSTRA OS PRODUTOS NA TELA
function mostrarProdutosNoCarrinho() {
    const itensSalvos = JSON.parse(localStorage.getItem("carrinho_atual")) || [];
    
    if (itensSalvos.length === 0) {
        espacoDosItens.innerHTML = "<p>Seu carrinho está vazio! Volte e escolha alguns doces. 🧁</p>";
        textoPrecoTotal.textContent = "R$ 0,00";
        return;
    }

    espacoDosItens.innerHTML = "";

    /* =========================================================================
       👉 RECURSIVIDADE: Calcula o valor total do carrinho de forma recursiva
       ========================================================================= */
    const calcularTotalRecursivo = (lista, indice) => {
        // Caso Base: Se o índice chegou ao fim do array, a soma parcial é 0
        if (indice >= lista.length) {
            return 0;
        }
        
        // Subtotal do item atual
        const subtotalItem = lista[indice].preco * lista[indice].quantidade;
        
        // Passo Recursivo: Soma o subtotal atual com o resultado do próximo índice
        return subtotalItem + calcularTotalRecursivo(lista, indice + 1);
    };

    // Executa a função recursiva começando do índice 0
    const somaTotal = calcularTotalRecursivo(itensSalvos, 0);

    // Renderiza as linhas dos produtos na tela utilizando .forEach() moderno
    itensSalvos.forEach((doce, i) => {
        const subtotalDoce = doce.preco * doce.quantidade;

        espacoDosItens.innerHTML += `
            <div class="item-carrinho-linha" style="border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${doce.nome}</strong> <br>
                    <small>Qtd: ${doce.quantidade} x R$ ${doce.preco.toFixed(2).replace('.', ',')}</small>
                </div>
                <div>
                    <span>R$ ${subtotalDoce.toFixed(2).replace('.', ',')}</span>
                    <button onclick="removerDoce(${i})" style="background: #ff4d4d; color: white; border: none; border-radius: 4px; padding: 3px 8px; margin-left: 10px; cursor: pointer;">X</button>
                </div>
            </div>
        `;
    });

    textoPrecoTotal.textContent = `R$ ${somaTotal.toFixed(2).replace('.', ',')}`;
}

// 3. FUNÇÃO PARA O BOTÃO DE REMOVER (X) - Atualizada para Arrow Function
window.removerDoce = (posicaoDoDoce) => {
    const itensSalvos = JSON.parse(localStorage.getItem("carrinho_atual")) || [];
    itensSalvos.splice(posicaoDoDoce, 1);
    localStorage.setItem("carrinho_atual", JSON.stringify(itensSalvos));
    mostrarProdutosNoCarrinho();
};

// 4. FAZ O CAMPO DE ENDEREÇO APARECER OU SUMIR (Atualizada para Arrow Function)
seletorEntrega.addEventListener("change", () => {
    if (seletorEntrega.value === "Entrega") {
        caixinhaEndereco.style.display = "block";
        campoEnderecoInput.required = true;
    } else {
        caixinhaEndereco.style.display = "none";
        campoEnderecoInput.required = false;
        campoEnderecoInput.value = "";
    }
});

// 5. FINALIZAÇÃO DO PEDIDO COM VALIDAÇÃO DE AUTENTICAÇÃO
botaoFinalizar.addEventListener("click", () => {
    /* =========================================================================
       👉 AUTENTICAÇÃO: Verifica se o usuário está logado antes de continuar
       ========================================================================= */
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario_logado"));

    if (!usuarioLogado) {
        alert("🔒 Você precisa estar logado para finalizar o pedido! Redirecionando para a página de login...");
        window.location.href = "login.html"; 
        return;
    }

    const metodoEntrega = seletorEntrega.value;
    const enderecoEntrega = campoEnderecoInput.value;
    const itensSalvos = JSON.parse(localStorage.getItem("carrinho_atual")) || [];

    // Validações de segurança antes de fechar a compra
    if (itensSalvos.length === 0) {
        alert("Adicione doces ao carrinho primeiro!");
        return;
    }
    if (metodoEntrega === "Entrega" && enderecoEntrega.trim() === "") {
        alert("Por favor, informe o seu endereço para o Delivery.");
        return;
    }

    // Mensagem customizada usando o nome recuperado do login via LocalStorage
    alert(`🧁 Pedido Realizado com Sucesso, ${usuarioLogado.nome}! Obrigado pela preferência.`);

    // Apaga o carrinho da memória para encerrar a compra
    localStorage.removeItem("carrinho_atual");

    // Redireciona de volta para a vitrine inicial
    window.location.href = "drdoces.html";
});

// 6. Carrega os dados na tela ao abrir a página
mostrarProdutosNoCarrinho();
