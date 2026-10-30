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
    // PETR4, VALE3, ITUB4 e MGLU3 funcionam sem token (sandbox gratuito).
    // Os demais (PRIO3, B3SA3 e os Fundos Imobiliários) só respondem quando
    // BRAPI_TOKEN (em scripts/api-config.js) estiver preenchido com um token
    // válido - o código já tenta buscar todos juntos e avisa se algum não
    // vier na resposta.
    var ACOES = {
        'petr4-petrobras': { ticker: 'PETR4', nome: 'PETR4 - Petrobras', tipo: 'acao' },
        'vale3-vale': { ticker: 'VALE3', nome: 'VALE3 - Vale', tipo: 'acao' },
        'itub4-itaú-unibanco': { ticker: 'ITUB4', nome: 'ITUB4 - Itaú Unibanco', tipo: 'acao' },
        'prio3-prio': { ticker: 'PRIO3', nome: 'PRIO3 - Prio', tipo: 'acao' },
        'b3sa3-b3': { ticker: 'B3SA3', nome: 'B3SA3 - B3', tipo: 'acao' },

        'cplg11-capinania-logística': { ticker: 'CPLG11', nome: 'CPLG11 - Capitania Logística', tipo: 'fii' },
        'btlg11-btg-pactual-logística': { ticker: 'BTLG11', nome: 'BTLG11 - BTG Pactual Logística', tipo: 'fii' },
        'trxf11-trx-estate': { ticker: 'TRXF11', nome: 'TRXF11 - TRX Real Estate', tipo: 'fii' },
        'xpml11-xp-malls': { ticker: 'XPML11', nome: 'XPML11 - XP Malls', tipo: 'fii' },
        'hglg11-patria-logística': { ticker: 'HGLG11', nome: 'HGLG11 - Patria Logística', tipo: 'fii' }
    };

    // Todos os tickers cadastrados, para pedir tudo numa única chamada.
    var TODOS_TICKERS = Object.keys(ACOES).map(function (chave) { return ACOES[chave].ticker; });

    // ---------------------------------------------------------------
    // PADRÃO VISUAL DOS GRÁFICOS
    // Somente a variação percentual recebe cores direcionais.
    // ---------------------------------------------------------------
    var CORES_GRAFICOS = {
        barra: '#64748b',
        barraFundo: '#1e293b',
        texto: '#cbd5e1',
        grade: '#263244',
        fundo: 'transparent',
        variacaoPositiva: '#22c55e',
        variacaoNegativa: '#ef4444'
    };

    function classeVariacao(valor) {
        var numero = Number(valor);

        if (!Number.isFinite(numero)) return '';

        return numero > 0
            ? 'positiva'
            : numero < 0
                ? 'negativa'
                : 'neutra';
    }

    function formatarVariacao(valor) {
        var numero = Number(valor);

        if (!Number.isFinite(numero)) return '—';

        var sinal = numero > 0 ? '+' : '';

        return sinal + numero.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + '%';
    }

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

    if (!form || !selectAtivo) {
        return;
    }

    // ---------------------------------------------------------------
    // Filtrar por Tipo: esconde no <select> de ativos as opções que não
    // pertencem à categoria escolhida em "Filtrar por Tipo".
    // ---------------------------------------------------------------
    var GRUPO_POR_FILTRO = {
        'tesouro-direto': 'Tesouro Direto',
        'cdb': 'CDB',
        'lci': 'LCI',
        'lca': 'LCA'
    };

    function opcaoPertenceAoFiltro(valor, filtro) {
        if (!filtro) return true;

        if (GRUPO_POR_FILTRO[filtro]) {
            return !!RENDA_FIXA[valor] && RENDA_FIXA[valor].grupo === GRUPO_POR_FILTRO[filtro];
        }
        if (filtro === 'mercado-de-ações') return !!ACOES[valor] && ACOES[valor].tipo === 'acao';
        if (filtro === 'fundo-imobiliario') return !!ACOES[valor] && ACOES[valor].tipo === 'fii';
        if (filtro === 'criptomoeda') return !!CRIPTOS[valor];

        return true;
    }

    function filtrarOpcoesPorTipo() {
        var filtro = selectFiltro.value;

        Array.prototype.forEach.call(selectAtivo.options, function (opcao) {
            if (opcao.value === '') return; // mantém sempre visível o placeholder "Escolha um Investimento..."

            var mostrar = opcaoPertenceAoFiltro(opcao.value, filtro);
            opcao.hidden = !mostrar;
            opcao.disabled = !mostrar;
        });

        // Se o ativo selecionado não pertence mais à categoria escolhida, limpa a seleção.
        if (selectAtivo.value && !opcaoPertenceAoFiltro(selectAtivo.value, filtro)) {
            selectAtivo.value = '';
        }
    }

    if (selectFiltro) {
        selectFiltro.addEventListener('change', filtrarOpcoesPorTipo);
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

    function buscarAcoes() {
        var tickerEscolhido = selectAtivo && ACOES[selectAtivo.value] ? ACOES[selectAtivo.value].ticker : TODOS_TICKERS[0];
        var url = 'https://brapi.dev/api/quote/' + encodeURIComponent(tickerEscolhido) + '?range=1mo&interval=1d';
        var headers = {};
        if (typeof BRAPI_TOKEN !== 'undefined' && BRAPI_TOKEN) {
            headers['Authorization'] = 'Bearer ' + BRAPI_TOKEN;
        }

        return fetch(url, { headers: headers }).then(function (resposta) {
            if (!resposta.ok) throw new Error('Falha ao consultar a API de ações (status ' + resposta.status + ').');
            return resposta.json();
        }).then(function (dados) {
            return dados.results || [];
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

        elLucroMensal.textContent = formatarMoeda(preco);
        rotuloLucroMensal.textContent = 'Preço Atual';

        elLucroAnual.textContent = formatarPercentual(variacao);
        rotuloLucroAnual.textContent = 'Variação (dia)';
        elLucroAnual.style.color = variacao >= 0 ? '#3ddc84' : '#f87171';

        elImposto.textContent = '15%';
        rotuloImposto.textContent = 'IR sobre Ganho';

        elLucroDesejado.textContent = formatarMoeda(maxima) + ' / ' + formatarMoeda(minima);
        rotuloLucroDesejado.textContent = 'Máx. / Mín. (dia)';

        infoEl.innerHTML =
            '<div class="info_linha"><span>Ativo</span><span>' + (acao.longName || acao.shortName || acao.symbol) + '</span></div>' +
            '<div class="info_linha"><span>Preço Atual</span><span>' + formatarMoeda(preco) + '</span></div>' +
            '<div class="info_linha"><span>Variação (dia)</span><span class="' + (variacao >= 0 ? 'positiva' : 'negativa') + '">' + formatarPercentual(variacao) + '</span></div>' +
            '<div class="info_linha"><span>Máxima (dia)</span><span>' + formatarMoeda(maxima) + '</span></div>' +
            '<div class="info_linha"><span>Mínima (dia)</span><span>' + formatarMoeda(minima) + '</span></div>' +
            '<div class="info_linha"><span>Volume</span><span>' + (acao.regularMarketVolume ? acao.regularMarketVolume.toLocaleString('pt-BR') : '—') + '</span></div>' +
            '<p class="info_fonte">Fonte: brapi.dev</p>';
    }

    function montarComparacaoAcao(lista, tickerSelecionado) {
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

    function anexarInformacoesDaMeta(valorProjetado) {
        var metaInput = document.getElementById('target-amount');
        var meta = metaInput ? parseFloat(metaInput.value) : NaN;
        var inicial = parseFloat(document.getElementById('initial-amount').value) || 0;
        var mensal = parseFloat(document.getElementById('monthly-amount').value) || 0;
        var tempo = parseFloat(document.getElementById('investment-time').value) || 0;
        var unidade = document.getElementById('time-unit').value;
        var meses = unidade === 'anos' ? Math.round(tempo * 12) : Math.round(tempo);
        var aportes = inicial + mensal * Math.max(0, meses);
        var linhas = '<div class="info_linha"><span>Valor Inicial</span><span>' + formatarMoeda(inicial) + '</span></div>' +
            '<div class="info_linha"><span>Aporte Mensal</span><span>' + formatarMoeda(mensal) + '</span></div>' +
            '<div class="info_linha"><span>Prazo</span><span>' + tempo + ' ' + unidade + '</span></div>';
        if (isFinite(meta) && meta > 0) {
            var diferenca = (isFinite(valorProjetado) ? valorProjetado : aportes) - meta;
            linhas += '<div class="info_linha"><span>Valor Final Desejado</span><span>' + formatarMoeda(meta) + '</span></div>' +
                '<div class="info_linha"><span>Status da Meta</span><span>' + (diferenca >= 0 ? 'Meta atingida' : 'Meta não atingida') + '</span></div>' +
                '<div class="info_linha"><span>' + (diferenca >= 0 ? 'Acima da meta' : 'Falta para a meta') + '</span><span>' + formatarMoeda(Math.abs(diferenca)) + '</span></div>';
            rotuloLucroDesejado.textContent = 'Valor Final Desejado';
            elLucroDesejado.textContent = (diferenca >= 0 ? 'Meta atingida: ' : 'Faltam ') + formatarMoeda(Math.abs(diferenca));
        } else {
            linhas += '<div class="info_linha"><span>Total de Aportes</span><span>' + formatarMoeda(aportes) + '</span></div>';
        }
        infoEl.innerHTML += linhas;
    }

    function montarGraficoCandlestick(ticker) {
        graficoEl.innerHTML = '<div id="grafico-candlestick" style="height:320px;width:100%"></div><p class="grafico_legenda">Candlesticks diários históricos fornecidos pela brapi.dev.</p>';
        var url = 'https://brapi.dev/api/quote/' + encodeURIComponent(ticker) + '?range=1mo&interval=1d';
        var headers = {};
        if (typeof BRAPI_TOKEN !== 'undefined' && BRAPI_TOKEN) headers.Authorization = 'Bearer ' + BRAPI_TOKEN;
        fetch(url, {headers: headers}).then(function(r){ if(!r.ok) throw new Error('Histórico indisponível ('+r.status+')'); return r.json(); })
        .then(function(d){
            var r = d.results && d.results[0];
            var candles = r && r.historicalDataPrice ? r.historicalDataPrice : [];
            if (!candles.length) throw new Error('A API não retornou histórico OHLC para '+ticker+'.');
            var el = document.getElementById('grafico-candlestick');
            if (!el || typeof LightweightCharts === 'undefined') throw new Error('Biblioteca de gráficos indisponível.');
            var chart = LightweightCharts.createChart(el, {width:el.clientWidth || 600, height:320, layout:{background:{color:'transparent'},textColor:'#cbd5e1'}, grid:{vertLines:{color:'#263244'},horzLines:{color:'#263244'}}, rightPriceScale:{borderColor:'#475569'}, timeScale:{borderColor:'#475569'}});
            var serie = chart.addCandlestickSeries({upColor:'#22c55e',downColor:'#ef4444',borderUpColor:'#22c55e',borderDownColor:'#ef4444',wickUpColor:'#22c55e',wickDownColor:'#ef4444'});
            serie.setData(candles.map(function(c){ return {time: new Date(c.date * 1000).toISOString().slice(0,10), open:Number(c.open), high:Number(c.high), low:Number(c.low), close:Number(c.close)}; }).filter(function(c){return c.open>0&&c.high>0&&c.low>0&&c.close>0;}));
            chart.timeScale().fitContent();
            window.addEventListener('resize', function(){ if(el.isConnected) chart.applyOptions({width:el.clientWidth || 600}); });
        }).catch(function(e){ console.warn(e); var el=document.getElementById('grafico-candlestick'); if(el) el.innerHTML='<p>Histórico candlestick indisponível para este ativo no momento. Confira o token e as permissões da Brapi.</p>'; });
    }

    // ---------------------------------------------------------------
    // Envio do formulário
    // ---------------------------------------------------------------
    form.addEventListener('submit', function (evento) {
        evento.preventDefault();

        document.querySelectorAll('.resultado_bloco, #btn-salvar-carteira').forEach(function (bloco) {
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
                anexarInformacoesDaMeta(parseFloat(document.getElementById('initial-amount').value || 0) + parseFloat(document.getElementById('monthly-amount').value || 0) * (document.getElementById('time-unit').value === 'anos' ? Number(document.getElementById('investment-time').value || 0) * 12 : Number(document.getElementById('investment-time').value || 0))); 
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

            buscarAcoes().then(function (lista) {
                var acao = lista.filter(function (a) { return a.symbol === infoAcao.ticker; })[0];

                if (!acao) {
                    var motivo = (typeof BRAPI_TOKEN !== 'undefined' && BRAPI_TOKEN)
                        ? 'Não foi possível carregar a cotação de ' + infoAcao.nome + ' agora.'
                        : 'Cotação de ' + infoAcao.nome + ' indisponível no plano gratuito da brapi.dev. Configure um token em scripts/api-config.js para liberar este ativo.';
                    limparResultados(motivo);
                    return;
                }

                preencherInfoAcao(acao);
                montarComparacaoAcao(lista, infoAcao.ticker);
                montarGraficoCandlestick(infoAcao.ticker);
                anexarInformacoesDaMeta(parseFloat(document.getElementById('initial-amount').value || 0) + parseFloat(document.getElementById('monthly-amount').value || 0) * (document.getElementById('time-unit').value === 'anos' ? Number(document.getElementById('investment-time').value || 0) * 12 : Number(document.getElementById('investment-time').value || 0))); 
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
                anexarInformacoesDaMeta(simulacao.saldoFinal);

                // Lucro Desejado: compara com o valor final que o usuário quer atingir
                var valorDesejado = parseFloat(document.getElementById('target-amount').value);
                if (valorDesejado && valorDesejado > 0) {
                    var diferenca = simulacao.saldoFinal - valorDesejado;
                    if (diferenca >= 0) {
                        elLucroDesejado.textContent = 'Meta atingida (+' + formatarMoeda(diferenca) + ')';
                    } else {
                        elLucroDesejado.textContent = 'Faltam ' + formatarMoeda(Math.abs(diferenca));
                    }
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

    // ---------------------------------------------------------------
    // Salvar na Carteira (usa scripts/carteira.js, incluído antes deste
    // arquivo em simula.php)
    // ---------------------------------------------------------------
    var btnSalvarCarteira = document.getElementById('btn-salvar-carteira');

    if (btnSalvarCarteira && typeof CarteiraDusk !== 'undefined') {
        var textoOriginalBotao = btnSalvarCarteira.textContent;

        btnSalvarCarteira.addEventListener('click', function () {
            var valorSelecionado = selectAtivo.value;
            var item = null;

            if (CRIPTOS[valorSelecionado]) {
                var infoCripto = CRIPTOS[valorSelecionado];
                item = { chave: valorSelecionado, tipo: 'cripto', nome: infoCripto.nome, par: infoCripto.par };
            } else if (ACOES[valorSelecionado]) {
                var infoAtivo = ACOES[valorSelecionado];
                item = { chave: valorSelecionado, tipo: infoAtivo.tipo, nome: infoAtivo.nome, ticker: infoAtivo.ticker };
            } else if (RENDA_FIXA[valorSelecionado]) {
                var infoRenda = RENDA_FIXA[valorSelecionado];
                item = { chave: valorSelecionado, tipo: 'renda-fixa', nome: infoRenda.nome, grupo: infoRenda.grupo, indexador: infoRenda.indexador };
            }

            if (!item) {
                btnSalvarCarteira.textContent = 'Escolha um ativo antes de salvar';
            } else {
                item.formulario = { valorInicial: document.getElementById('initial-amount').value, aporteMensal: document.getElementById('monthly-amount').value, tempo: document.getElementById('investment-time').value, unidade: document.getElementById('time-unit').value, meta: document.getElementById('target-amount').value };
                item.simulacaoSalvaEm = new Date().toISOString();
                var salvou = CarteiraDusk.salvar(item);
                btnSalvarCarteira.textContent = salvou ? '✔ Salvo na Carteira!' : 'Este ativo já está na sua Carteira';
            }

            setTimeout(function () { btnSalvarCarteira.textContent = textoOriginalBotao; }, 2200);
        });
    }

})();