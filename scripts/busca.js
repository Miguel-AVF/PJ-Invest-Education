(function () {

    // ---------------------------------------------------------------
    // Índice de busca do site: cada entrada tem um título, a página de
    // destino e uma lista de termos que, se baterem com o que a pessoa
    // digitou, mostram essa sugestão.
    // ---------------------------------------------------------------
    var INDICE = [
        { titulo: 'Início', url: 'index.php', termos: ['inicio', 'início', 'home', 'página inicial', 'pagina inicial'] },
        { titulo: 'Informativo', url: 'informa.php', termos: ['informativo', 'informações', 'informacoes', 'conteúdo', 'conteudo', 'investimentos', 'guia de investimentos'] },
        { titulo: 'Tesouro Direto', url: 'informa.php#tesouro-direto', termos: ['tesouro direto', 'tesouro selic', 'tesouro ipca', 'tesouro prefixado'] },
        { titulo: 'CDB', url: 'informa.php#cdb', termos: ['cdb', 'certificado de depósito bancário', 'certificado de deposito bancario'] },
        { titulo: 'LCI', url: 'informa.php#lci', termos: ['lci', 'letra de crédito imobiliário', 'letra de credito imobiliario'] },
        { titulo: 'LCA', url: 'informa.php#lca', termos: ['lca', 'letra de crédito do agronegócio', 'letra de credito do agronegocio'] },
        { titulo: 'Mercado de Ações', url: 'informa.php#mercado-de-acoes', termos: ['ações', 'acoes', 'mercado de ações', 'bolsa', 'petr4', 'vale3', 'itub4', 'prio3', 'b3sa3', 'petrobras', 'vale', 'itau', 'itaú'] },
        { titulo: 'Fundos Imobiliários', url: 'informa.php#fundos-imobiliarios', termos: ['fundos imobiliários', 'fundos imobiliarios', 'fii', 'fiis', 'cplg11', 'btlg11', 'trxf11', 'xpml11', 'hglg11'] },
        { titulo: 'Criptomoedas', url: 'informa.php#criptomoedas', termos: ['criptomoedas', 'cripto', 'bitcoin', 'btc', 'ethereum', 'eth', 'tether', 'usdt', 'bnb', 'solana', 'sol'] },
        { titulo: 'Simulador de Investimentos', url: 'simula.php', termos: ['simulador', 'simular', 'simulação', 'simulacao', 'calculadora', 'calcular rendimento'] },
        { titulo: 'Minha Carteira', url: 'carteira.php', termos: ['carteira', 'minha carteira', 'ativos salvos', 'favoritos'] },
        { titulo: 'Sobre Nós', url: 'sobre.php', termos: ['sobre', 'sobre nós', 'sobre nos', 'quem somos'] },
        { titulo: 'Cadastro', url: 'cadastro.php', termos: ['cadastro', 'criar conta', 'cadastrar', 'registrar'] },
        { titulo: 'Login', url: 'login.php', termos: ['login', 'entrar', 'acessar conta', 'fazer login'] }
    ];

    function normalizar(texto) {
        return texto
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // remove acentos
    }

    function buscar(consulta) {
        var termoBusca = normalizar(consulta).trim();
        if (!termoBusca) return [];

        return INDICE.filter(function (item) {
            if (normalizar(item.titulo).indexOf(termoBusca) !== -1) return true;
            return item.termos.some(function (termo) { return normalizar(termo).indexOf(termoBusca) !== -1; });
        }).slice(0, 8);
    }

    // ---------------------------------------------------------------
    // Liga o autocomplete em cada barra de pesquisa da página (o
    // formulário é incluído via includes/menu.php em todas as páginas)
    // ---------------------------------------------------------------
    document.querySelectorAll('.search-bar').forEach(function (barraBusca) {
        var form = barraBusca.querySelector('form');
        var input = barraBusca.querySelector('input[name="q"]');
        if (!form || !input) return;

        var lista = document.createElement('div');
        lista.className = 'busca_sugestoes escondido';
        barraBusca.appendChild(lista);

        var indiceAtivo = -1;

        function irPara(url) {
            window.location.href = url;
        }

        function renderizarSugestoes(resultados) {
            indiceAtivo = -1;

            if (resultados.length === 0) {
                lista.innerHTML = '<div class="busca_sugestao busca_sugestao--vazia">Nenhuma página encontrada</div>';
                lista.classList.remove('escondido');
                return;
            }

            lista.innerHTML = resultados.map(function (item, indice) {
                return '<div class="busca_sugestao" data-url="' + item.url + '" data-indice="' + indice + '">' + item.titulo + '</div>';
            }).join('');
            lista.classList.remove('escondido');

            lista.querySelectorAll('.busca_sugestao[data-url]').forEach(function (elSugestao) {
                elSugestao.addEventListener('mousedown', function (evento) {
                    evento.preventDefault(); // evita o blur do input antes do clique
                    irPara(elSugestao.getAttribute('data-url'));
                });
            });
        }

        function esconderSugestoes() {
            lista.classList.add('escondido');
            indiceAtivo = -1;
        }

        input.setAttribute('autocomplete', 'off');

        input.addEventListener('input', function () {
            var resultados = buscar(input.value);
            if (!input.value.trim()) {
                esconderSugestoes();
                return;
            }
            renderizarSugestoes(resultados);
        });

        input.addEventListener('focus', function () {
            if (input.value.trim()) renderizarSugestoes(buscar(input.value));
        });

        input.addEventListener('blur', function () {
            // pequeno atraso pra permitir o mousedown da sugestão acontecer antes
            setTimeout(esconderSugestoes, 150);
        });

        // Navegação pelo teclado (setas + Enter)
        input.addEventListener('keydown', function (evento) {
            var opcoes = lista.querySelectorAll('.busca_sugestao[data-url]');
            if (lista.classList.contains('escondido') || opcoes.length === 0) return;

            if (evento.key === 'ArrowDown') {
                evento.preventDefault();
                indiceAtivo = Math.min(indiceAtivo + 1, opcoes.length - 1);
            } else if (evento.key === 'ArrowUp') {
                evento.preventDefault();
                indiceAtivo = Math.max(indiceAtivo - 1, 0);
            } else {
                return;
            }

            opcoes.forEach(function (op) { op.classList.remove('busca_sugestao--ativa'); });
            opcoes[indiceAtivo].classList.add('busca_sugestao--ativa');
        });

        // Envio do formulário (clique na lupa ou Enter): vai direto pra
        // melhor página encontrada.
        form.addEventListener('submit', function (evento) {
            evento.preventDefault();

            var opcoes = lista.querySelectorAll('.busca_sugestao[data-url]');
            if (indiceAtivo >= 0 && opcoes[indiceAtivo]) {
                irPara(opcoes[indiceAtivo].getAttribute('data-url'));
                return;
            }

            var resultados = buscar(input.value);
            if (resultados.length > 0) {
                irPara(resultados[0].url);
            } else {
                input.classList.add('busca_sem_resultado');
                setTimeout(function () { input.classList.remove('busca_sem_resultado'); }, 600);
            }
        });
    });

})();
