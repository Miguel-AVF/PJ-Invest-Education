(function () {

    var lista = document.getElementById('carteira-lista');
    var vazio = document.getElementById('carteira-vazia');

    if (!lista || typeof CarteiraDusk === 'undefined') return;

    // Mesmas APIs usadas em scripts/simulador.js e scripts/informa-live.js
    var BCB_SGS_BASE = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.';
    var BCB_SERIES = { selic: 432, cdi: 4389, ipca: 13522 };
    var CRYPTO_API_URL = 'https://economia.awesomeapi.com.br/last/BTC-BRL,ETH-BRL,USDT-BRL,BNB-BRL,SOL-BRL';

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

    function rotuloTipo(tipo) {
        return {
            acao: 'Ação',
            fii: 'Fundo Imobiliário',
            cripto: 'Criptomoeda',
            'renda-fixa': 'Renda Fixa'
        }[tipo] || tipo;
    }

    function cartaoBase(item) {
        return '<div class="carteira_item" id="carteira-item-' + item.id + '">' +
            '<div class="carteira_item_cabecalho">' +
            '<div>' +
            '<span class="carteira_badge">' + rotuloTipo(item.tipo) + '</span>' +
            '<h3>' + item.nome + '</h3>' +
            '</div>' +
            '<button type="button" class="carteira_remover" data-id="' + item.id + '">Remover</button>' +
            '</div>' +
            '<div class="carteira_item_corpo" id="carteira-corpo-' + item.id + '">' +
            '<div class="info_linha"><span>Status</span><span>Buscando dados...</span></div>' +
            (item.formulario ? '<div class="info_linha"><span>Valor Inicial</span><span>' + formatarMoeda(Number(item.formulario.valorInicial)) + '</span></div><div class="info_linha"><span>Aporte Mensal</span><span>' + formatarMoeda(Number(item.formulario.aporteMensal)) + '</span></div><div class="info_linha"><span>Prazo</span><span>' + item.formulario.tempo + ' ' + item.formulario.unidade + '</span></div>' + (Number(item.formulario.meta)>0 ? '<div class="info_linha"><span>Valor Final Desejado</span><span>' + formatarMoeda(Number(item.formulario.meta)) + '</span></div>' : '') : '') +
            ((item.tipo === 'acao' || item.tipo === 'fii') ? '<div id="carteira-grafico-' + item.id + '" style="height:260px;width:100%;margin-top:14px"></div>' : '') +
            '</div>' +
            '</div>';
    }

    function render() {
        var itens = CarteiraDusk.listar();

        if (itens.length === 0) {
            lista.innerHTML = '';
            if (vazio) vazio.classList.remove('escondido');
            return;
        }

        if (vazio) vazio.classList.add('escondido');
        lista.innerHTML = itens.map(cartaoBase).join('');

        // Liga os botões de remover
        lista.querySelectorAll('.carteira_remover').forEach(function (botao) {
            botao.addEventListener('click', function () {
                CarteiraDusk.remover(botao.getAttribute('data-id'));
                render();
            });
        });

        carregarDadosAoVivo(itens);
    }

    function preencherCorpo(id, html) {
        var el = document.getElementById('carteira-corpo-' + id);
        if (el) el.innerHTML = html;
    }

    function carregarDadosAoVivo(itens) {
        var acoesEFiis = itens.filter(function (i) { return i.tipo === 'acao' || i.tipo === 'fii'; });
        var criptos = itens.filter(function (i) { return i.tipo === 'cripto'; });
        var rendaFixa = itens.filter(function (i) { return i.tipo === 'renda-fixa'; });

        if (acoesEFiis.length > 0) { buscarAcoesSalvas(acoesEFiis); acoesEFiis.forEach(montarGraficoCarteira); }
        if (criptos.length > 0) buscarCriptosSalvas(criptos);
        if (rendaFixa.length > 0) buscarRendaFixaSalva(rendaFixa);
    }

    // ---------------- Ações e FIIs (brapi.dev) ----------------
    function montarGraficoCarteira(item) {
        var el = document.getElementById('carteira-grafico-' + item.id);
        if (!el) return;
        var url = 'https://brapi.dev/api/quote/' + encodeURIComponent(item.ticker) + '?range=1mo&interval=1d';
        var headers = {};
        if (typeof BRAPI_TOKEN !== 'undefined' && BRAPI_TOKEN) headers.Authorization = 'Bearer ' + BRAPI_TOKEN;
        fetch(url, {headers:headers}).then(function(r){if(!r.ok) throw new Error('HTTP '+r.status); return r.json();}).then(function(d){
            var r=d.results&&d.results[0], hist=r&&r.historicalDataPrice?r.historicalDataPrice:[];
            if(!hist.length || typeof LightweightCharts==='undefined') throw new Error('Histórico não disponível');
            var chart=LightweightCharts.createChart(el,{width:el.clientWidth||500,height:260,layout:{background:{color:'transparent'},textColor:'#cbd5e1'},grid:{vertLines:{color:'#263244'},horzLines:{color:'#263244'}},timeScale:{timeVisible:false}});
            var serie=chart.addCandlestickSeries({upColor:'#22c55e',downColor:'#ef4444',borderUpColor:'#22c55e',borderDownColor:'#ef4444',wickUpColor:'#22c55e',wickDownColor:'#ef4444'});
            serie.setData(hist.map(function(c){return {time:new Date(c.date*1000).toISOString().slice(0,10),open:+c.open,high:+c.high,low:+c.low,close:+c.close};}).filter(function(c){return c.open>0&&c.high>0&&c.low>0&&c.close>0;})); chart.timeScale().fitContent();
        }).catch(function(){if(el) el.innerHTML='<small>Gráfico histórico indisponível no momento.</small>';});
    }

    function buscarAcoesSalvas(itens) {
        var headers = {};
        if (typeof BRAPI_TOKEN !== 'undefined' && BRAPI_TOKEN) headers.Authorization = 'Bearer ' + BRAPI_TOKEN;
        Promise.all(itens.map(function(item){ return fetch('https://brapi.dev/api/quote/' + encodeURIComponent(item.ticker), {headers:headers}).then(function(r){if(!r.ok) throw new Error('status '+r.status);return r.json();}).then(function(d){return d.results||[];}); })).then(function(lotes){
            var resultados = [].concat.apply([], lotes);

            itens.forEach(function (item) {
                var ativo = resultados.filter(function (a) { return a.symbol === item.ticker; })[0];

                if (!ativo) {
                    preencherCorpo(item.id, '<div class="info_linha"><span>Cotação</span><span>Indisponível ' +
                        (typeof BRAPI_TOKEN !== 'undefined' && BRAPI_TOKEN ? 'no momento' : 'sem token da brapi.dev') + '</span></div>');
                    return;
                }

                var variacao = ativo.regularMarketChangePercent;
                preencherCorpo(item.id,
                    '<div class="info_linha"><span>Preço Atual</span><span>' + formatarMoeda(ativo.regularMarketPrice) + '</span></div>' +
                    '<div class="info_linha"><span>Variação (dia)</span><span class="' + (variacao >= 0 ? 'positiva' : 'negativa') + '">' + formatarPercentual(variacao) + '</span></div>' +
                    '<p class="info_fonte">Fonte: brapi.dev</p>'
                );
            });
        }).catch(function (erro) {
            console.error(erro);
            itens.forEach(function (item) {
                preencherCorpo(item.id, '<div class="info_linha"><span>Cotação</span><span>Não foi possível carregar agora</span></div>');
            });
        });
    }

    // ---------------- Criptomoedas (AwesomeAPI) ----------------
    function buscarCriptosSalvas(itens) {
        fetch(CRYPTO_API_URL).then(function (resposta) {
            if (!resposta.ok) throw new Error('Falha na API de criptomoedas.');
            return resposta.json();
        }).then(function (dados) {
            itens.forEach(function (item) {
                var moeda = dados[item.par];
                if (!moeda) {
                    preencherCorpo(item.id, '<div class="info_linha"><span>Cotação</span><span>Indisponível no momento</span></div>');
                    return;
                }

                var preco = parseFloat(moeda.bid);
                var variacao = parseFloat(moeda.pctChange);

                preencherCorpo(item.id,
                    '<div class="info_linha"><span>Preço Atual</span><span>' + formatarMoeda(preco) + '</span></div>' +
                    '<div class="info_linha"><span>Variação (24h)</span><span class="' + (variacao >= 0 ? 'positiva' : 'negativa') + '">' + formatarPercentual(variacao) + '</span></div>' +
                    '<p class="info_fonte">Fonte: AwesomeAPI</p>'
                );
            });
        }).catch(function (erro) {
            console.error(erro);
            itens.forEach(function (item) {
                preencherCorpo(item.id, '<div class="info_linha"><span>Cotação</span><span>Não foi possível carregar agora</span></div>');
            });
        });
    }

    // ---------------- Renda Fixa (Banco Central) ----------------
    function buscarSerieBCB(codigo) {
        var url = BCB_SGS_BASE + codigo + '/dados/ultimos/1?formato=json';
        return fetch(url).then(function (resposta) {
            if (!resposta.ok) throw new Error('Falha ao consultar o Banco Central.');
            return resposta.json();
        }).then(function (dados) {
            if (!dados || !dados[0]) throw new Error('Série sem dados.');
            return parseFloat(String(dados[0].valor).replace(',', '.'));
        });
    }

    function buscarRendaFixaSalva(itens) {
        Promise.all([
            buscarSerieBCB(BCB_SERIES.selic),
            buscarSerieBCB(BCB_SERIES.cdi),
            buscarSerieBCB(BCB_SERIES.ipca)
        ]).then(function (valores) {
            var indicadores = { selic: valores[0], cdi: valores[1], ipca: valores[2] };

            itens.forEach(function (item) {
                var taxa = indicadores[item.indexador];
                var indexadorNome = item.indexador === 'selic' ? 'Selic' : (item.indexador === 'cdi' ? 'CDI' : 'IPCA (12m)');

                preencherCorpo(item.id,
                    '<div class="info_linha"><span>Grupo</span><span>' + item.grupo + '</span></div>' +
                    '<div class="info_linha"><span>Indexador</span><span>' + indexadorNome + ' (' + formatarTaxa(taxa) + ')</span></div>' +
                    '<p class="info_fonte">Fonte: Banco Central do Brasil (SGS)</p>'
                );
            });
        }).catch(function (erro) {
            console.error(erro);
            itens.forEach(function (item) {
                preencherCorpo(item.id, '<div class="info_linha"><span>Taxa</span><span>Não foi possível carregar agora</span></div>');
            });
        });
    }

    document.addEventListener('DOMContentLoaded', render);

})();
