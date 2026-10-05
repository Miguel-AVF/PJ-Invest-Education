(function () {

    // ---------------------------------------------------------------
    // Mesmas APIs usadas no simulador (scripts/simulador.js):
    // - Banco Central (SGS): Selic, CDI e IPCA 12m - sem token
    // - AwesomeAPI: cotação de criptomoedas - sem token
    // - brapi.dev: cotação de ações e FIIs via brapi-proxy.php.
    //   O token fica protegido no servidor.
    // ---------------------------------------------------------------
    var BCB_SGS_BASE = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.';
    var BCB_SERIES = { selic: 432, cdi: 4389, ipca: 13522 };

    var CRYPTO_API_URL = 'https://economia.awesomeapi.com.br/last/BTC-BRL,ETH-BRL,USDT-BRL,BNB-BRL,SOL-BRL';
    var CRIPTO_PARES = { BTC: 'BTCBRL', ETH: 'ETHBRL', USDT: 'USDTBRL', BNB: 'BNBBRL', SOL: 'SOLBRL' };

    var TICKERS_ACOES = ['PETR4', 'VALE3', 'ITUB4', 'PRIO3', 'B3SA3', 'CPLG11', 'BTLG11', 'TRXF11', 'XPML11', 'HGLG11'];

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

    // ---------------------------------------------------------------
    // Taxas (Selic, CDI, IPCA) - Banco Central
    // ---------------------------------------------------------------
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

    function atualizarTaxas() {
        var elSelic = document.getElementById('taxa-selic');
        var elIpca = document.getElementById('taxa-ipca');
        var elCdiCdb = document.getElementById('taxa-cdi-cdb');
        var elCdiLci = document.getElementById('taxa-cdi-lci');
        var elCdiLca = document.getElementById('taxa-cdi-lca');

        if (!elSelic && !elIpca && !elCdiCdb && !elCdiLci && !elCdiLca) return;

        Promise.all([
            buscarSerieBCB(BCB_SERIES.selic),
            buscarSerieBCB(BCB_SERIES.cdi),
            buscarSerieBCB(BCB_SERIES.ipca)
        ]).then(function (valores) {
            var selic = valores[0], cdi = valores[1], ipca = valores[2];

            if (elSelic) elSelic.textContent = 'Selic: ' + formatarTaxa(selic);
            if (elIpca) elIpca.textContent = 'IPCA 12m: ' + formatarTaxa(ipca);
            if (elCdiCdb) elCdiCdb.textContent = 'CDI: ' + formatarTaxa(cdi);
            if (elCdiLci) elCdiLci.textContent = 'CDI: ' + formatarTaxa(cdi);
            if (elCdiLca) elCdiLca.textContent = 'CDI: ' + formatarTaxa(cdi);
        }).catch(function (erro) {
            console.error(erro);
            [elSelic, elIpca, elCdiCdb, elCdiLci, elCdiLca].forEach(function (el) {
                if (el) el.textContent = 'Taxa indisponível no momento';
            });
        });
    }

    // ---------------------------------------------------------------
    // Criptomoedas - AwesomeAPI
    // ---------------------------------------------------------------
    function atualizarCriptos() {
        var algumElemento = Object.keys(CRIPTO_PARES).some(function (sigla) {
            return document.getElementById('cotacao-' + sigla);
        });
        if (!algumElemento) return;

        fetch(CRYPTO_API_URL).then(function (resposta) {
            if (!resposta.ok) throw new Error('Falha ao consultar a API de criptomoedas.');
            return resposta.json();
        }).then(function (dados) {
            Object.keys(CRIPTO_PARES).forEach(function (sigla) {
                var el = document.getElementById('cotacao-' + sigla);
                if (!el) return;

                var moeda = dados[CRIPTO_PARES[sigla]];
                if (!moeda) return;

                var preco = parseFloat(moeda.bid);
                var variacao = parseFloat(moeda.pctChange);

                var span = document.createElement('span');
                span.className = 'cotacao_valor ' + (variacao >= 0 ? 'positiva' : 'negativa');
                span.textContent = ' ' + formatarMoeda(preco) + ' (' + formatarPercentual(variacao) + ')';
                el.appendChild(span);
            });
        }).catch(function (erro) {
            console.error(erro);
        });
    }

    // ---------------------------------------------------------------
    // Ações e FIIs - brapi.dev
    // ---------------------------------------------------------------
    function atualizarAcoes() {
        var algumElemento = TICKERS_ACOES.some(function (ticker) {
            return document.getElementById('cotacao-' + ticker);
        });
        if (!algumElemento) return;

        var url = 'brapi-proxy.php?tickers=' + encodeURIComponent(TICKERS_ACOES.join(','));

        fetch(url).then(function (resposta) {
            if (!resposta.ok) throw new Error('Falha ao consultar a API de ações (status ' + resposta.status + ').');
            return resposta.json();
        }).then(function (dados) {
            var resultados = dados.results || [];

            resultados.forEach(function (ativo) {
                var el = document.getElementById('cotacao-' + ativo.symbol);
                if (!el) return;

                var span = document.createElement('span');
                span.className = 'cotacao_valor ' + (ativo.regularMarketChangePercent >= 0 ? 'positiva' : 'negativa');
                span.textContent = ' ' + formatarMoeda(ativo.regularMarketPrice) + ' (' + formatarPercentual(ativo.regularMarketChangePercent) + ')';
                el.appendChild(span);
            });
        }).catch(function (erro) {
            console.error(erro);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        atualizarTaxas();
        atualizarCriptos();
        atualizarAcoes();
    });

})();