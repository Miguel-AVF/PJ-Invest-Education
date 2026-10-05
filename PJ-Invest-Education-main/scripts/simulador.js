(function () {

    // ---------------------------------------------------------------
    // APIs conectadas
    // ---------------------------------------------------------------
    var CRYPTO_API_URL = 'https://economia.awesomeapi.com.br/last/BTC-BRL,ETH-BRL,USDT-BRL,BNB-BRL,SOL-BRL';

    // Banco Central do Brasil - Sistema Gerenciador de Séries Temporais (SGS)
    // API pública, sem necessidade de token. Usada para Tesouro Direto, CDB, LCI e LCA.
    var BCB_SGS_BASE = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.';
    var BCB_SERIES = {
        selic: 432,   // Meta Selic definida pelo Copom (% a.a.)
        cdi: 4389,    // CDI acumulado no mês, anualizado (% a.a.)
        ipca: 13522   // IPCA acumulado em 12 meses (% a.a.)
    };

    // Mapeia o value de cada <option> do simulador para o par usado pela AwesomeAPI
    var CRIPTOS = {
        'btc-bitcoin': { par: 'BTCBRL', nome: 'Bitcoin (BTC)' },
        'eth-ethereum': { par: 'ETHBRL', nome: 'Ethereum (ETH)' },
        'usdt-ther': { par: 'USDTBRL', nome: 'Tether (USDT)' },
        'bnb-binance-coin-/-build-and-build': { par: 'BNBBRL', nome: 'BNB (Binance Coin)' },
        'sol-solana': { par: 'SOLBRL', nome: 'Solana (SOL)' }
    };

    // Mapeia o value de cada <option> para o ticker usado pela brapi.dev.
    // A autenticação agora é feita pelo brapi-proxy.php no servidor para
    // evitar expor o token no JavaScript do navegador.
    var ACOES = {
        'petr4-petrobras': { ticker: 'PETR4', nome: 'PETR4 - Petrobras', tipo: 'mercado-de-ações' },
        'vale3-vale': { ticker: 'VALE3', nome: 'VALE3 - Vale', tipo: 'mercado-de-ações' },
        'itub4-itaú-unibanco': { ticker: 'ITUB4', nome: 'ITUB4 - Itaú Unibanco', tipo: 'mercado-de-ações' },
        'prio3-prio': { ticker: 'PRIO3', nome: 'PRIO3 - Prio', tipo: 'mercado-de-ações' },
        'b3sa3-b3': { ticker: 'B3SA3', nome: 'B3SA3 - B3', tipo: 'mercado-de-ações' },

        'cplg11-capinania-logística': { ticker: 'CPLG11', nome: 'CPLG11 - Capitania Logística', tipo: 'fundo-imobiliario' },
        'btlg11-btg-pactual-logística': { ticker: 'BTLG11', nome: 'BTLG11 - BTG Pactual Logística', tipo: 'fundo-imobiliario' },
        'trxf11-trx-estate': { ticker: 'TRXF11', nome: 'TRXF11 - TRX Real Estate', tipo: 'fundo-imobiliario' },
        'xpml11-xp-malls': { ticker: 'XPML11', nome: 'XPML11 - XP Malls', tipo: 'fundo-imobiliario' },
        'hglg11-patria-logística': { ticker: 'HGLG11', nome: 'HGLG11 - Patria Logística', tipo: 'fundo-imobiliario' }
    };


    // ---------------------------------------------------------------
    // Renda Fixa (Tesouro Direto, CDB, LCI e LCA) - Banco Central do Brasil
    // ---------------------------------------------------------------
    // Como a taxa exata de cada título/CDB varia por instituição e não tem uma
    // API pública e gratuita com CORS liberado, usamos os indexadores oficiais
    // do Banco Central (Selic, CDI e IPCA) e aplicamos o percentual/spread mais
    // comum de mercado para cada produto. É uma ESTIMATIVA educativa, não a
    // taxa exata do seu banco ou do Tesouro Direto.
    var RENDA_FIXA = {
        'tesouro-selic': { grupo: 'Tesouro Direto', nome: 'Tesouro Selic', indexador: 'selic', percentual: 1.00 },
        'tesouro-ipca': { grupo: 'Tesouro Direto', nome: 'Tesouro IPCA', indexador: 'ipca', spread: 5.5 },
        'tesouro-ipca-com-juros': { grupo: 'Tesouro Direto', nome: 'Tesouro IPCA+ c/ Juros Semestrais', indexador: 'ipca', spread: 5.8 },
        'tesouro-prefixado': { grupo: 'Tesouro Direto', nome: 'Tesouro Prefixado', indexador: 'selic', spread: 0.5 },
        'tesouro-prefixado-com-juros': { grupo: 'Tesouro Direto', nome: 'Tesouro Prefixado c/ Juros Semestrais', indexador: 'selic', spread: 0.8 },

        'cdb-100%-do-cdi-com-liquidez-diaria': { grupo: 'CDB', nome: 'CDB 100% do CDI (liquidez diária)', indexador: 'cdi', percentual: 1.00 },
        'cdb-105%-do-cdi': { grupo: 'CDB', nome: 'CDB 105% do CDI', indexador: 'cdi', percentual: 1.05 },
        'cdb-110%-do-cdi': { grupo: 'CDB', nome: 'CDB 110% do CDI', indexador: 'cdi', percentual: 1.10 },
        'cdb-prefixado': { grupo: 'CDB', nome: 'CDB Prefixado', indexador: 'cdi', percentual: 1.00, spread: 1.0 },
        'cdb-ipca-+-taxa-fixa': { grupo: 'CDB', nome: 'CDB IPCA + Taxa Fixa', indexador: 'ipca', spread: 5.0 },

        'lci-90%-do-cdi': { grupo: 'LCI', nome: 'LCI 90% do CDI', indexador: 'cdi', percentual: 0.90, isento: true },
        'lci-95%-do-cdi': { grupo: 'LCI', nome: 'LCI 95% do CDI', indexador: 'cdi', percentual: 0.95, isento: true },
        'lci-100%-do-cdi': { grupo: 'LCI', nome: 'LCI 100% do CDI', indexador: 'cdi', percentual: 1.00, isento: true },
        'lci-prefixado': { grupo: 'LCI', nome: 'LCI Prefixado', indexador: 'cdi', percentual: 0.95, isento: true },
        'lci-ipca-+-taxa-fixa': { grupo: 'LCI', nome: 'LCI IPCA + Taxa Fixa', indexador: 'ipca', spread: 4.0, isento: true },

        'lca-90%-do-cdi': { grupo: 'LCA', nome: 'LCA 90% do CDI', indexador: 'cdi', percentual: 0.90, isento: true },
        'lca-95%-do-cdi': { grupo: 'LCA', nome: 'LCA 95% do CDI', indexador: 'cdi', percentual: 0.95, isento: true },
        'lca-100%-do-cdi': { grupo: 'LCA', nome: 'LCA 100% do CDI', indexador: 'cdi', percentual: 1.00, isento: true },
        'lca-prefixado': { grupo: 'LCA', nome: 'LCA Prefixado', indexador: 'cdi', percentual: 0.95, isento: true },
        'lca-ipca-+-taxa-fixa': { grupo: 'LCA', nome: 'LCA IPCA + Taxa Fixa', indexador: 'ipca', spread: 4.0, isento: true }
    };

    var form = document.getElementById('investment-simulator-form');
    var selectAtivo = document.getElementById('investment-option');

    var selectFiltro = document.getElementById('filter-type');

    // O usuário escolhe o tipo e o simulador mostra somente os investimentos
    // que realmente estão conectados a uma fonte de dados no projeto.
    function tipoDoInvestimento(valor) {
        if (RENDA_FIXA[valor]) return RENDA_FIXA[valor].grupo === 'Tesouro Direto' ? 'tesouro-direto' : RENDA_FIXA[valor].grupo.toLowerCase();
        if (ACOES[valor]) return ACOES[valor].tipo;
        if (CRIPTOS[valor]) return 'criptomoeda';
        return '';
    }

    function atualizarFiltroDeInvestimentos() {
        if (!selectFiltro) return;
        var filtro = selectFiltro.value;
        var opcoes = Array.prototype.slice.call(selectAtivo.options);
        var opcaoAtual = selectAtivo.value;

        opcoes.forEach(function (opcao) {
            if (!opcao.value) return;
            var tipo = tipoDoInvestimento(opcao.value);
            opcao.hidden = !!filtro && tipo !== filtro;
        });

        if (opcaoAtual && filtro && tipoDoInvestimento(opcaoAtual) !== filtro) {
            selectAtivo.value = '';
        }
    }

    if (selectFiltro) {
        selectFiltro.addEventListener('change', atualizarFiltroDeInvestimentos);
    }
    atualizarFiltroDeInvestimentos();

    if (!form || !selectAtivo) {
        return;
    }

    var elLucroMensal = document.getElementById('lucro-mensal');
    var elLucroAnual = document.getElementById('lucro-anual');
    var elImposto = document.getElementById('imposto');
    var elLucroDesejado = document.getElementById('lucro-desejado');

    var rotuloLucroMensal = document.getElementById('rotulo-lucro-mensal');
    var rotuloLucroAnual = document.getElementById('rotulo-lucro-anual');
    var rotuloImposto = document.getElementById('rotulo-imposto');
    var rotuloLucroDesejado = document.getElementById('rotulo-lucro-desejado');

    var graficoEl = document.getElementById('grafico-conteudo');
    var comparacaoEl = document.getElementById('comparacao-conteudo');
    var infoEl = document.getElementById('info-especificas-conteudo');

    // ---------------------------------------------------------------
    // Utilidades de formatação
    // ---------------------------------------------------------------
    function formatarMoeda(valor) {
        if (isNaN(valor)) return '—';
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatarPercentual(valor) {
        if (isNaN(valor)) return '—';
        var sinal = valor > 0 ? '+' : '';
        return sinal + valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + '%';
    }

    function formatarTaxa(valor) {
        if (isNaN(valor)) return '—';
        return valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + '% a.a.';
    }

    // Lê a meta final informada pelo usuário e calcula a diferença em relação
    // ao valor projetado. Para renda variável, mostramos a meta e os aportes
    // planejados, sem inventar uma rentabilidade futura.
    function obterDadosMeta() {
        var valorMeta = parseFloat(document.getElementById('target-amount').value);
        var valorInicial = parseFloat(document.getElementById('initial-amount').value) || 0;
        var valorMensal = parseFloat(document.getElementById('monthly-amount').value) || 0;
        var tempo = parseFloat(document.getElementById('investment-time').value) || 0;
        var unidade = document.getElementById('time-unit').value;
        var totalMeses = unidade === 'anos' ? Math.round(tempo * 12) : Math.round(tempo);
        var aportes = valorInicial + (valorMensal * Math.max(0, totalMeses));

        return {
            valorMeta: valorMeta > 0 ? valorMeta : null,
            aportes: aportes,
            totalMeses: totalMeses
        };
    }

    function textoMetaProjetada(valorProjetado) {
        var meta = obterDadosMeta();
        if (!meta.valorMeta) return 'Nenhuma meta final informada';

        var diferenca = valorProjetado - meta.valorMeta;
        if (diferenca >= 0) {
            return 'Meta atingida (+' + formatarMoeda(diferenca) + ')';
        }
        return 'Faltam ' + formatarMoeda(Math.abs(diferenca));
    }

    function montarInfoMeta(meta, valorProjetado, observacao) {
        if (!meta.valorMeta) {
            return '<div class="info_linha"><span>Meta Final Desejada</span><span>Não informada</span></div>' +
                '<div class="info_linha"><span>Aportes Planejados</span><span>' + formatarMoeda(meta.aportes) + '</span></div>' +
                (observacao ? '<p class="info_fonte">' + observacao + '</p>' : '');
        }

        var diferenca = valorProjetado - meta.valorMeta;
        var status = diferenca >= 0
            ? 'Meta atingida (+' + formatarMoeda(diferenca) + ')'
            : 'Faltam ' + formatarMoeda(Math.abs(diferenca));

        return '<div class="info_linha"><span>Meta Final Desejada</span><span>' + formatarMoeda(meta.valorMeta) + '</span></div>' +
            '<div class="info_linha"><span>Valor Projetado</span><span>' + formatarMoeda(valorProjetado) + '</span></div>' +
            '<div class="info_linha"><span>Status da Meta</span><span class="' + (diferenca >= 0 ? 'positiva' : 'negativa') + '">' + status + '</span></div>' +
            (observacao ? '<p class="info_fonte">' + observacao + '</p>' : '');
    }

    function restaurarRotulosPadrao() {
        rotuloLucroMensal.textContent = 'Lucro Mensal';
        rotuloLucroAnual.textContent = 'Lucro Anual';
        rotuloImposto.textContent = 'Imposto';
        rotuloLucroDesejado.textContent = 'Lucro Desejado';
    }

    function limparResultados(mensagem) {
        elLucroMensal.textContent = '—';
        elLucroAnual.textContent = '—';
        elImposto.textContent = '—';
        elLucroDesejado.textContent = '—';
        elLucroMensal.style.color = '';
        elLucroAnual.style.color = '';
        restaurarRotulosPadrao();

        var texto = mensagem || 'O gráfico da simulação aparecerá aqui.';
        graficoEl.innerHTML = '<div class="bloco_placeholder">' + texto + '</div>';
        comparacaoEl.innerHTML = '<div class="bloco_placeholder">' + texto + '</div>';
        infoEl.innerHTML = '<div class="bloco_placeholder">' + texto + '</div>';
    }

    function mostrarCarregando() {
        graficoEl.innerHTML = '<div class="bloco_placeholder">Buscando cotação...</div>';
        comparacaoEl.innerHTML = '<div class="bloco_placeholder">Buscando cotação...</div>';
        infoEl.innerHTML = '<div class="bloco_placeholder">Buscando cotação...</div>';
    }

    // ---------------------------------------------------------------
    // Chamadas às APIs
    // ---------------------------------------------------------------
    function buscarCriptos() {
        return fetch(CRYPTO_API_URL).then(function (resposta) {
            if (!resposta.ok) throw new Error('Falha ao consultar a API de criptomoedas.');
            return resposta.json();
        });
    }

    function buscarAcoes(ticker) {
        var url = 'brapi-proxy.php?tickers=' + encodeURIComponent(ticker);

        return fetch(url, { cache: 'no-store' }).then(function (resposta) {
            return resposta.json().catch(function () { return {}; }).then(function (dados) {
                if (!resposta.ok) {
                    var detalhe = dados.details ? ' ' + dados.details : '';
                    throw new Error((dados.error || 'Falha ao consultar a API da brapi.dev (status ' + resposta.status + ').') + detalhe);
                }
                return dados.results || [];
            });
        });
    }

    // Busca uma série do SGS/BCB e retorna o valor mais recente (número).
    function buscarSerieBCB(codigo) {
        var url = BCB_SGS_BASE + codigo + '/dados/ultimos/1?formato=json';
        return fetch(url).then(function (resposta) {
            if (!resposta.ok) throw new Error('Falha ao consultar o Banco Central (série ' + codigo + ').');
            return resposta.json();
        }).then(function (dados) {
            if (!dados || !dados[0]) throw new Error('Série ' + codigo + ' sem dados no Banco Central.');
            return parseFloat(String(dados[0].valor).replace(',', '.'));
        });
    }

    // Busca Selic, CDI e IPCA (12 meses) de uma vez, em paralelo.
    function buscarIndicadoresBCB() {
        return Promise.all([
            buscarSerieBCB(BCB_SERIES.selic),
            buscarSerieBCB(BCB_SERIES.cdi),
            buscarSerieBCB(BCB_SERIES.ipca)
        ]).then(function (valores) {
            return { selic: valores[0], cdi: valores[1], ipca: valores[2] };
        });
    }

    // ---------------------------------------------------------------
    // Criptomoedas (AwesomeAPI)
    // ---------------------------------------------------------------
    function preencherInfoCripto(moeda, nome) {
        var preco = parseFloat(moeda.bid);
        var meta = obterDadosMeta();
        var variacao = parseFloat(moeda.pctChange);
        var maxima = parseFloat(moeda.high);
        var minima = parseFloat(moeda.low);

        elLucroMensal.textContent = formatarMoeda(preco);
        rotuloLucroMensal.textContent = 'Preço Atual';

        elLucroAnual.textContent = formatarPercentual(variacao);
        rotuloLucroAnual.textContent = 'Variação (24h)';
        elLucroAnual.style.color = variacao >= 0 ? '#3ddc84' : '#f87171';

        elImposto.textContent = '15% a 22,5%';
        rotuloImposto.textContent = 'IR sobre Ganho';

        elLucroDesejado.textContent = formatarMoeda(maxima) + ' / ' + formatarMoeda(minima);
        rotuloLucroDesejado.textContent = 'Máx. / Mín. (24h)';

        infoEl.innerHTML =
            '<div class="info_linha"><span>Ativo</span><span>' + nome + '</span></div>' +
            '<div class="info_linha"><span>Preço Atual</span><span>' + formatarMoeda(preco) + '</span></div>' +
            '<div class="info_linha"><span>Variação (24h)</span><span class="' + (variacao >= 0 ? 'positiva' : 'negativa') + '">' + formatarPercentual(variacao) + '</span></div>' +
            '<div class="info_linha"><span>Máxima (24h)</span><span>' + formatarMoeda(maxima) + '</span></div>' +
            '<div class="info_linha"><span>Mínima (24h)</span><span>' + formatarMoeda(minima) + '</span></div>' +
            '<div class="info_linha"><span>Atualizado em</span><span>' + moeda.create_date + '</span></div>' +
            montarInfoMeta(meta, meta.aportes, 'Em criptomoedas, não é feita uma previsão de rentabilidade futura; a meta é comparada aos aportes planejados.') +
            '<p class="info_fonte">Fonte: AwesomeAPI (economia.awesomeapi.com.br)</p>';
    }

    function montarComparacaoCripto(dados, parSelecionado) {
        var linhas = Object.keys(CRIPTOS).map(function (chave) {
            var info = CRIPTOS[chave];
            var moeda = dados[info.par];
            if (!moeda) return '';

            var preco = parseFloat(moeda.bid);
            var variacao = parseFloat(moeda.pctChange);
            var destaque = info.par === parSelecionado ? ' comparacao_item--ativo' : '';

            return '<div class="comparacao_item' + destaque + '">' +
                '<span class="comparacao_nome">' + info.nome + '</span>' +
                '<span class="comparacao_preco">' + formatarMoeda(preco) + '</span>' +
                '<span class="comparacao_variacao ' + (variacao >= 0 ? 'positiva' : 'negativa') + '">' + formatarPercentual(variacao) + '</span>' +
                '</div>';
        }).join('');

        comparacaoEl.innerHTML = '<div class="comparacao_lista">' + linhas + '</div>' +
            '<p class="info_fonte">Fonte: AwesomeAPI (economia.awesomeapi.com.br)</p>';
    }

    function montarGraficoCripto(dados) {
        var itens = Object.keys(CRIPTOS).map(function (chave) {
            var info = CRIPTOS[chave];
            var moeda = dados[info.par];
            if (!moeda) return null;
            return { nome: info.par.replace('BRL', ''), preco: parseFloat(moeda.bid) };
        }).filter(Boolean);

        var maiorPreco = Math.max.apply(null, itens.map(function (item) { return item.preco; }));

        var barras = itens.map(function (item) {
            var largura = Math.max(4, (item.preco / maiorPreco) * 100);
            return '<div class="grafico_linha">' +
                '<span class="grafico_rotulo">' + item.nome + '</span>' +
                '<div class="grafico_barra"><div class="grafico_barra_fill" style="width:' + largura + '%"></div></div>' +
                '<span class="grafico_valor">' + formatarMoeda(item.preco) + '</span>' +
                '</div>';
        }).join('');

        graficoEl.innerHTML = '<div class="grafico_barras">' + barras + '</div>' +
            '<p class="grafico_legenda">Comparativo do preço atual entre as criptomoedas cadastradas.</p>';
    }

    // ---------------------------------------------------------------
    // Ações e Fundos Imobiliários (brapi.dev)
    // ---------------------------------------------------------------
    function preencherInfoAcao(acao) {
        var preco = acao.regularMarketPrice;
        var variacao = acao.regularMarketChangePercent;
        var maxima = acao.regularMarketDayHigh;
        var minima = acao.regularMarketDayLow;
        var meta = obterDadosMeta();

        elLucroMensal.textContent = formatarMoeda(preco);
        rotuloLucroMensal.textContent = 'Preço Atual';

        elLucroAnual.textContent = formatarPercentual(variacao);
        rotuloLucroAnual.textContent = 'Variação (dia)';
        elLucroAnual.style.color = variacao >= 0 ? '#3ddc84' : '#f87171';

        elImposto.textContent = '15%';
        rotuloImposto.textContent = 'IR sobre Ganho';

        elLucroDesejado.textContent = meta.valorMeta ? formatarMoeda(meta.valorMeta) : (formatarMoeda(maxima) + ' / ' + formatarMoeda(minima));
        rotuloLucroDesejado.textContent = meta.valorMeta ? 'Meta Final' : 'Máx. / Mín. (dia)';

        infoEl.innerHTML =
            '<div class="info_linha"><span>Ativo</span><span>' + (acao.longName || acao.shortName || acao.symbol) + '</span></div>' +
            '<div class="info_linha"><span>Preço Atual</span><span>' + formatarMoeda(preco) + '</span></div>' +
            '<div class="info_linha"><span>Variação (dia)</span><span class="' + (variacao >= 0 ? 'positiva' : 'negativa') + '">' + formatarPercentual(variacao) + '</span></div>' +
            '<div class="info_linha"><span>Máxima (dia)</span><span>' + formatarMoeda(maxima) + '</span></div>' +
            '<div class="info_linha"><span>Mínima (dia)</span><span>' + formatarMoeda(minima) + '</span></div>' +
            '<div class="info_linha"><span>Volume</span><span>' + (acao.regularMarketVolume ? acao.regularMarketVolume.toLocaleString('pt-BR') : '—') + '</span></div>' +
            montarInfoMeta(meta, meta.aportes, 'Em ações e FIIs, o valor futuro não é projetado com uma rentabilidade fixa. A meta é comparada aos aportes planejados para evitar uma previsão financeira artificial.') +
            '<p class="info_fonte">Fonte: brapi.dev</p>';
    }

    function montarComparacaoAcao(lista, tickerSelecionado) {
        var chaveSelecionada = Object.keys(ACOES).find(function (chave) {
            return ACOES[chave].ticker === tickerSelecionado;
        });
        var tipoSelecionado = chaveSelecionada ? ACOES[chaveSelecionada].tipo : '';
        var tickersDoMesmoTipo = Object.keys(ACOES).filter(function (chave) {
            return ACOES[chave].tipo === tipoSelecionado;
        }).map(function (chave) { return ACOES[chave].ticker; });
        lista = lista.filter(function (acao) { return tickersDoMesmoTipo.indexOf(acao.symbol) !== -1; });

        var linhas = lista.map(function (acao) {
            var destaque = acao.symbol === tickerSelecionado ? ' comparacao_item--ativo' : '';
            return '<div class="comparacao_item' + destaque + '">' +
                '<span class="comparacao_nome">' + acao.symbol + '</span>' +
                '<span class="comparacao_preco">' + formatarMoeda(acao.regularMarketPrice) + '</span>' +
                '<span class="comparacao_variacao ' + (acao.regularMarketChangePercent >= 0 ? 'positiva' : 'negativa') + '">' + formatarPercentual(acao.regularMarketChangePercent) + '</span>' +
                '</div>';
        }).join('');

        comparacaoEl.innerHTML = '<div class="comparacao_lista">' + linhas + '</div>' +
            '<p class="info_fonte">Fonte: brapi.dev</p>';
    }

    function montarGraficoAcao(lista) {
        var maiorPreco = Math.max.apply(null, lista.map(function (a) { return a.regularMarketPrice; }));

        var barras = lista.map(function (acao) {
            var largura = Math.max(4, (acao.regularMarketPrice / maiorPreco) * 100);
            return '<div class="grafico_linha">' +
                '<span class="grafico_rotulo">' + acao.symbol + '</span>' +
                '<div class="grafico_barra"><div class="grafico_barra_fill" style="width:' + largura + '%"></div></div>' +
                '<span class="grafico_valor">' + formatarMoeda(acao.regularMarketPrice) + '</span>' +
                '</div>';
        }).join('');

        graficoEl.innerHTML = '<div class="grafico_barras">' + barras + '</div>' +
            '<p class="grafico_legenda">Comparativo do preço atual entre as ações cadastradas.</p>';
    }

    // ---------------------------------------------------------------
    // Renda Fixa (Tesouro Direto, CDB, LCI e LCA) - cálculo com Selic/CDI/IPCA
    // ---------------------------------------------------------------

    // Calcula a taxa anual estimada (% a.a.) de um investimento a partir dos
    // indicadores atuais do Banco Central.
    function calcularTaxaAnual(config, indicadores) {
        var base = indicadores[config.indexador];
        var taxa = config.percentual ? base * config.percentual : base;
        if (config.spread) taxa += config.spread;
        return taxa;
    }

    // Tabela regressiva de Imposto de Renda para renda fixa (não vale para LCI/LCA, que são isentas)
    function calcularAliquotaIR(diasTotais) {
        if (diasTotais <= 180) return 0.225;
        if (diasTotais <= 360) return 0.20;
        if (diasTotais <= 720) return 0.175;
        return 0.15;
    }

    // Simula o saldo mês a mês com juros compostos e aportes mensais.
    function simularRendaFixa(valorInicial, valorMensal, totalMeses, taxaAnual) {
        var taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
        var saldo = valorInicial;
        var totalInvestido = valorInicial;
        var lucroUltimoMes = 0;
        var evolucaoAnual = [];

        for (var mes = 1; mes <= totalMeses; mes++) {
            var juros = saldo * taxaMensal;
            saldo += juros;
            saldo += valorMensal;
            totalInvestido += valorMensal;
            lucroUltimoMes = juros;

            if (mes % 12 === 0 || mes === totalMeses) {
                evolucaoAnual.push({ mes: mes, saldo: saldo });
            }
        }

        return {
            saldoFinal: saldo,
            totalInvestido: totalInvestido,
            lucroTotal: saldo - totalInvestido,
            lucroUltimoMes: lucroUltimoMes,
            evolucaoAnual: evolucaoAnual
        };
    }

    function preencherInfoRendaFixa(config, indicadores, taxaAnual, simulacao, diasTotais) {
        var meta = obterDadosMeta();
        elLucroMensal.textContent = formatarMoeda(simulacao.lucroUltimoMes);

        var lucroProximosDozeMeses = simulacao.saldoFinal * (taxaAnual / 100);
        elLucroAnual.textContent = formatarMoeda(lucroProximosDozeMeses);

        var aliquota = config.isento ? 0 : calcularAliquotaIR(diasTotais);
        if (config.isento) {
            elImposto.textContent = 'Isento';
        } else {
            var valorImposto = simulacao.lucroTotal * aliquota;
            elImposto.textContent = formatarMoeda(valorImposto);
        }

        var indexadorNome = config.indexador === 'selic' ? 'Selic' : (config.indexador === 'cdi' ? 'CDI' : 'IPCA (12m)');

        infoEl.innerHTML =
            '<div class="info_linha"><span>Ativo</span><span>' + config.nome + '</span></div>' +
            '<div class="info_linha"><span>Indexador</span><span>' + indexadorNome + ' (' + formatarTaxa(indicadores[config.indexador]) + ')</span></div>' +
            '<div class="info_linha"><span>Taxa Estimada</span><span>' + formatarTaxa(taxaAnual) + '</span></div>' +
            '<div class="info_linha"><span>Total Investido</span><span>' + formatarMoeda(simulacao.totalInvestido) + '</span></div>' +
            '<div class="info_linha"><span>Saldo Final Projetado</span><span>' + formatarMoeda(simulacao.saldoFinal) + '</span></div>' +
            '<div class="info_linha"><span>Lucro Total (bruto)</span><span class="positiva">' + formatarMoeda(simulacao.lucroTotal) + '</span></div>' +
            '<div class="info_linha"><span>Imposto de Renda</span><span>' + (config.isento ? 'Isento' : (aliquota * 100).toLocaleString('pt-BR') + '%') + '</span></div>' +
            montarInfoMeta(meta, simulacao.saldoFinal) +
            '<p class="info_fonte">Fonte dos indexadores: Banco Central do Brasil (SGS). Taxa do produto estimada com base no percentual/spread médio de mercado - não é a taxa exata do seu banco ou do Tesouro Direto.</p>';
    }

    function montarComparacaoRendaFixa(config, indicadores) {
        var linhas = Object.keys(RENDA_FIXA).filter(function (chave) {
            return RENDA_FIXA[chave].grupo === config.grupo;
        }).map(function (chave) {
            var info = RENDA_FIXA[chave];
            var taxa = calcularTaxaAnual(info, indicadores);
            var destaque = info === config ? ' comparacao_item--ativo' : '';

            return '<div class="comparacao_item' + destaque + '">' +
                '<span class="comparacao_nome">' + info.nome + '</span>' +
                '<span class="comparacao_preco">' + formatarTaxa(taxa) + '</span>' +
                '<span class="comparacao_variacao">' + (info.isento ? 'Isento IR' : 'Com IR') + '</span>' +
                '</div>';
        }).join('');

        comparacaoEl.innerHTML = '<div class="comparacao_lista">' + linhas + '</div>' +
            '<p class="info_fonte">Fonte: Banco Central do Brasil (SGS) - comparação entre os produtos de ' + config.grupo + ' cadastrados.</p>';
    }

    function montarGraficoRendaFixa(simulacao) {
        var maiorSaldo = Math.max.apply(null, simulacao.evolucaoAnual.map(function (p) { return p.saldo; }));

        var barras = simulacao.evolucaoAnual.map(function (ponto, indice) {
            var largura = Math.max(4, (ponto.saldo / maiorSaldo) * 100);
            var rotulo = (ponto.mes % 12 === 0) ? ('Ano ' + (ponto.mes / 12)) : (ponto.mes + ' meses');
            return '<div class="grafico_linha">' +
                '<span class="grafico_rotulo">' + rotulo + '</span>' +
                '<div class="grafico_barra"><div class="grafico_barra_fill" style="width:' + largura + '%"></div></div>' +
                '<span class="grafico_valor">' + formatarMoeda(ponto.saldo) + '</span>' +
                '</div>';
        }).join('');

        graficoEl.innerHTML = '<div class="grafico_barras">' + barras + '</div>' +
            '<p class="grafico_legenda">Evolução estimada do saldo (aportes + juros compostos) ao longo do tempo.</p>';
    }

    // ---------------------------------------------------------------
    // Envio do formulário
    // ---------------------------------------------------------------
    form.addEventListener('submit', function (evento) {
        evento.preventDefault();

        document.querySelectorAll('.resultado_bloco').forEach(function (bloco) {
            bloco.classList.remove('escondido');
        });

        var valorSelecionado = selectAtivo.value;

        // ---------------- Criptomoedas ----------------
        if (CRIPTOS[valorSelecionado]) {
            mostrarCarregando();

            buscarCriptos().then(function (dados) {
                var info = CRIPTOS[valorSelecionado];
                var moeda = dados[info.par];
                if (!moeda) throw new Error('Criptomoeda não encontrada na resposta da API.');

                preencherInfoCripto(moeda, info.nome);
                montarComparacaoCripto(dados, info.par);
                montarGraficoCripto(dados);
            }).catch(function (erro) {
                console.error(erro);
                limparResultados('Não foi possível carregar a cotação agora. Tente novamente em instantes.');
            });

            return;
        }

        // ---------------- Ações e Fundos Imobiliários ----------------
        if (ACOES[valorSelecionado]) {
            var infoAcao = ACOES[valorSelecionado];

            mostrarCarregando();

            buscarAcoes(infoAcao.ticker).then(function (lista) {
                var acao = lista.filter(function (a) { return a.symbol === infoAcao.ticker; })[0];

                if (!acao) {
                    var motivo = 'Não foi possível carregar a cotação de ' + infoAcao.nome + '. Verifique o token da brapi.dev e a configuração do brapi-proxy.php.';
                    limparResultados(motivo);
                    return;
                }

                preencherInfoAcao(acao);
                montarComparacaoAcao(lista, infoAcao.ticker);
                montarGraficoAcao(lista);
            }).catch(function (erro) {
                console.error(erro);
                limparResultados('Não foi possível carregar a cotação agora. Tente novamente em instantes.');
            });

            return;
        }

        // ---------------- Renda Fixa (Tesouro, CDB, LCI, LCA) ----------------
        if (RENDA_FIXA[valorSelecionado]) {
            var config = RENDA_FIXA[valorSelecionado];

            var valorInicial = parseFloat(document.getElementById('initial-amount').value) || 0;
            var valorMensal = parseFloat(document.getElementById('monthly-amount').value) || 0;
            var tempo = parseFloat(document.getElementById('investment-time').value) || 0;
            var unidade = document.getElementById('time-unit').value;
            var totalMeses = unidade === 'anos' ? Math.round(tempo * 12) : Math.round(tempo);

            if (totalMeses <= 0) {
                limparResultados('Informe um tempo de investimento válido para simular.');
                return;
            }

            mostrarCarregando();

            buscarIndicadoresBCB().then(function (indicadores) {
                var taxaAnual = calcularTaxaAnual(config, indicadores);
                var simulacao = simularRendaFixa(valorInicial, valorMensal, totalMeses, taxaAnual);
                var diasTotais = totalMeses * 30;

                preencherInfoRendaFixa(config, indicadores, taxaAnual, simulacao, diasTotais);
                montarComparacaoRendaFixa(config, indicadores);
                montarGraficoRendaFixa(simulacao);

                // Meta final: compara o saldo projetado com o objetivo informado.
                var meta = obterDadosMeta();
                if (meta.valorMeta) {
                    elLucroDesejado.textContent = textoMetaProjetada(simulacao.saldoFinal);
                    rotuloLucroDesejado.textContent = 'Meta Final';
                } else {
                    rotuloLucroDesejado.textContent = 'Saldo Final Projetado';
                    elLucroDesejado.textContent = formatarMoeda(simulacao.saldoFinal);
                }
            }).catch(function (erro) {
                console.error(erro);
                limparResultados('Não foi possível consultar os indicadores do Banco Central agora. Tente novamente em instantes.');
            });

            return;
        }

        // Tipo de investimento sem opção reconhecida.
        limparResultados('Ainda não há uma API conectada para este tipo de investimento.');
    });

})();