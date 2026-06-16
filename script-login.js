document.addEventListener('DOMContentLoaded', iniciarPaginaLogin);

function iniciarPaginaLogin() {
    // 1. MAPEAMENTO DOS ELEMENTOS DO HTML (Padronizado para const)
    const formAuth = document.getElementById('form-autenticacao');
    const areaUsuarioLogado = document.getElementById('area-usuario-logado');
    const textoBoasVindas = document.getElementById('texto-usuario-boasvindas');
    const btnLogout = document.getElementById('btn-logout');
    const loginTitulo = document.getElementById('login-titulo');
    const grupoNomeCadastro = document.getElementById('grupo-nome-cadastro');
    const btnAcaoAuth = document.getElementById('btn-acao-auth');
    const alternarAuthTexto = document.getElementById('alternar-auth-texto');
    const linkAlternar = document.getElementById('link-ir-para-cadastro');
    
    const inputNomeUser = document.getElementById('usuario-nome');
    const inputEmailUser = document.getElementById('usuario-email');
    const inputSenhaUser = document.getElementById('usuario-senha');

    let modoCadastro = false;

    // Inicializa o banco de dados simulado caso esteja vazio
    if (localStorage.getItem('banco_usuarios') === null) {
        localStorage.setItem('banco_usuarios', JSON.stringify([]));
    }

    // Inicializa a verificação de quem está logado
    verificarSessao();

    /* =========================================================================
       👉 RECURSIVIDADE: Mantida e padronizada com Arrow Function (Mais moderna)
       ========================================================================= */
    const buscarUsuarioRecursivo = (lista, emailAlvo, indice) => {
        // Caso Base 1: Se o índice chegou no final do array, o usuário não existe
        if (indice >= lista.length) {
            return null;
        }
        
        // Caso Base 2: Se achou o e-mail igual, retorna o usuário encontrado
        if (lista[indice].email === emailAlvo) {
            return lista[indice];
        }
        
        // Passo Recursivo: Chama a função novamente avançando o índice (+1)
        return buscarUsuarioRecursivo(lista, emailAlvo, indice + 1);
    };

    // 2. ALTERNÂNCIA DE MODO (LOGIN / CADASTRO)
    if (linkAlternar !== null) {
        linkAlternar.addEventListener('click', alternarModo);
    }

    function alternarModo(evento) {
        evento.preventDefault();
        modoCadastro = !modoCadastro;
        configurarFormulario();
    }

    function configurarFormulario() {
        if (modoCadastro === true) {
            loginTitulo.textContent = "📝 Criar Nova Conta";
            grupoNomeCadastro.style.display = "flex";
            btnAcaoAuth.textContent = "Cadastrar e Entrar";
            alternarAuthTexto.innerHTML = 'Já tem uma conta? <a href="#" id="lk-mudar" style="color:#E5A93C;font-weight:bold;text-decoration:none;">Faça login aqui</a>';
        } else {
            loginTitulo.textContent = "🔑 Entrar na Minha Conta";
            grupoNomeCadastro.style.display = "none";
            btnAcaoAuth.textContent = "Entrar";
            alternarAuthTexto.innerHTML = 'Não tem uma conta? <a href="#" id="lk-mudar" style="color:#E5A93C;font-weight:bold;text-decoration:none;">Cadastre-se aqui</a>';
        }
        
        // Readiciona o evento do clique usando Arrow Function
        document.getElementById('lk-mudar').addEventListener('click', (e) => {
            e.preventDefault();
            modoCadastro = !modoCadastro;
            configurarFormulario();
        });
    }

    // 3. ENVIO DO FORMULÁRIO (LOGIN OU CADASTRO)
    if (formAuth !== null) {
        formAuth.addEventListener('submit', enviarFormulario);
    }

    function enviarFormulario(evento) {
        evento.preventDefault();
        
        const emailDigitado = inputEmailUser.value.trim().toLowerCase();
        const senhaDigitada = inputSenhaUser.value.trim();
        const banco = JSON.parse(localStorage.getItem('banco_usuarios')) || [];

        // 👉 CHAMADA DA FUNÇÃO RECURSIVA: Procura começando do índice 0
        const usuarioEncontrado = buscarUsuarioRecursivo(banco, emailDigitado, 0);

        if (modoCadastro === true) {
            // Fluxo de Cadastro
            if (usuarioEncontrado !== null) {
                alert("Este e-mail já está cadastrado!");
                return;
            }

            const novoUsuario = {
                nome: inputNomeUser.value.trim(),
                email: emailDigitado,
                senha: senhaDigitada
            };

            banco.push(novoUsuario);
            localStorage.setItem('banco_usuarios', JSON.stringify(banco));
            localStorage.setItem('usuario_logado', JSON.stringify(novoUsuario));
            
            alert("Conta criada com sucesso!");
            window.location.href = "index.html";
        } else {
            // Fluxo de Login
            if (usuarioEncontrado === null || usuarioEncontrado.senha !== senhaDigitada) {
                alert("E-mail ou senha incorretos!");
                return;
            }

            localStorage.setItem('usuario_logado', JSON.stringify(usuarioEncontrado));
            alert("Login efetuado com sucesso!");
            window.location.href = "index.html";
        }
    }

    // 4. LOGOUT (Atualizado para Arrow Function)
    if (btnLogout !== null) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('usuario_logado');
            alert("Você saiu da conta!");
            window.location.reload();
        });
    }

    // 5. CONTROLE DE SESSÃO E INTERFACE (Atualizado para Template Literals)
    function verificarSessao() {
        const logado = JSON.parse(localStorage.getItem('usuario_logado'));
        
        if (logado) {
            if (formAuth) formAuth.style.display = "none";
            if (alternarAuthTexto) alternarAuthTexto.style.display = "none";
            
            loginTitulo.textContent = "👤 Dados do Perfil";
            textoBoasVindas.textContent = `Olá, ${logado.nome}! Você está conectado.`;
            
            if (areaUsuarioLogado) areaUsuarioLogado.style.display = "block";
        }
    }
}
