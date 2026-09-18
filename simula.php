<?php

    include __DIR__. '/includes/head.php';

?>

<?php

    include __DIR__. '/includes/menu.php';

?>

<form id="investment-simulator-form" class="simulator-form">
    <h2>Simulador de Investimentos</h2>

    <!-- Filtro por Tipo -->
    <div class="form-group">
        <label for="filter-type">Filtrar por Tipo:</label>
        <select id="filter-type" name="filterType">
            <option value="">Tipos</option>
            <option value="tesouro-direto">Tesouro direto</option>
            <option value="cdb">CDB</option>
            <option value="lci">LCI</option>
            <option value="lca">LCA</option>
            <option value="mercado-de-ações">Mercado de ações</option>
            <option value="fundo-imobiliario">Fundos Imobiliários</option>
            <option value="criptomoeda">Criptomoedas</option>
        </select>
    </div>

    <!-- Campo de Pesquisa -->
    <div class="form-group">
        <label for="search-investment">Pesquisar Investimento:</label>
        <input type="text" id="search-investment" name="searchInvestment" placeholder="Ex: Tesouro Direto, PETR4, CDB..." />
    </div>

    <!-- Seleção na Lista de Opções -->
    <div class="form-group">
        <label for="investment-option">Selecione o Ativo/Produto:</label>
        <select id="investment-option" name="investmentOption" required>
            <option value="" disabled selected>Escolha um Investimento...</option>
            <option value="tesouro-selic">Tesouro Selic</option>
            <option value="tesouro-ipca">Tesouro IPCA</option>
            <option value="tesouro-ipca-com-juros">Tesouro IPCA com Juros Semestrais</option>
            <option value="tesouro-prefixado">Tesouro Prefixado</option>
            <option value="tesouro-prefixado-com-juros">Tesouro Prefixado com Juros Semestrais</option>

            <option value="cdb-100%-do-cdi-com-liquidez-diaria">CDB 100% do CDI com liquidez diária</option>
            <option value="cdb-105%-do-cdi">CDB 105% do CDI</option>
            <option value="cdb-110%-do-cdi">CDB 110% do CDI</option>
            <option value="cdb-prefixado">CDB prefixado</option>
            <option value="cdb-ipca-+-taxa-fixa">CDB IPCA + taxa fixa</option>

            <option value="lci-90%-do-cdi">LCI 90% do CDI</option>
            <option value="lci-95%-do-cdi">LCI 95% do CDI</option>
            <option value="lci-100%-do-cdi">LCI 100% do CDI</option>
            <option value="lci-prefixado">LCI Prefixado</option>
            <option value="lci-ipca-+-taxa-fixa">LCI IPCA + Taxa Fixa</option>

            <option value="lca-90%-do-cdi">LCA 90% do CDI</option>
            <option value="lca-95%-do-cdi">LCA 95% do CDI</option>
            <option value="lca-100%-do-cdi">LCA 100% do CDI</option>
            <option value="lca-prefixado">LCA prefixado</option>
            <option value="lca-ipca-+-taxa-fixa">LCA IPCA + taxa fixa</option>

            <option value="petr4-petrobras">PETR4 - Petrobras</option>
            <option value="vale3-vale">VALE3 - Vale</option>
            <option value="itub4-itaú-unibanco">ITUB4 - Itaú Unibanco</option>
            <option value="prio3-prio">PRIO3 - Prio</option>
            <option value="b3sa3-b3">B3SA3 - B3</option>

            <option value="cplg11-capinania-logística">CPLG11 - Capitania Logística</option>
            <option value="btlg11-btg-pactual-logística">BTLG11 - BTG Pactual Logística</option>
            <option value="trxf11-trx-estate">TRXF11 - TRX Real Estate</option>
            <option value="xpml11-xp-malls">XPML11 - XP Malls</option>
            <option value="hglg11-patria-logística">HGLG11 - Patria Logistica</option>

            <option value="btc-bitcoin">BTC - Bitcoin</option>
            <option value="eth-ethereum">ETH - Ethereum</option>
            <option value="usdt-ther">USDT - Tether</option>
            <option value="bnb-binance-coin-/-build-and-build">BNB - (Binance Coin/Build and Build)</option>
            <option value="sol-solana">SOL - Solana</option>
        </select>
    </div>

    <hr>

    <!-- Valor Final Pretendido -->
    <div class="form-group">
        <label for="target-amount">Valor Final Desejado (Opcional):</label>
        <input type="number" id="target-amount" name="targetAmount" placeholder="Ex: 100000.00" step="0.01" />
        <small>Quanto você pretende faturar/acumular no total?</small>
    </div>

    <!-- Valor Inicial -->
    <div class="form-group">
        <label for="initial-amount">Valor Inicial (R$):</label>
        <input type="number" id="initial-amount" name="initialAmount" placeholder="Ex: 1000.00" step="0.01" required />
    </div>

    <!-- Valor Mensal -->
    <div class="form-group">
        <label for="monthly-amount">Valor Mensal (R$):</label>
        <input type="number" id="monthly-amount" name="monthlyAmount" placeholder="Ex: 300.00" step="0.01" required />
    </div>

    <!-- Tempo de Investimento -->
    <div class="form-group">
        <label for="investment-time">Tempo de Investimento:</label>
        <div class="time-inputs">
            <input type="number" id="investment-time" name="investmentTime" placeholder="Ex: 5" required />
            <select id="time-unit" name="timeUnit">
                <option value="meses">Meses</option>
                <option value="anos" selected>Anos</option>
            </select>
        </div>
    </div>

    <!-- Botão de Envio -->
    <button type="submit" class="btn-simulate">Simular Agora</button>
</form>


<div class="resultado_simulador">

    <div class="resultado_stats">
        <div class="stat_card">
            <span class="stat_icone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </span>
            <span class="stat_rotulo">Lucro Mensal</span>
            <span class="stat_valor" id="lucro-mensal">—</span>
        </div>

        <div class="stat_card">
            <span class="stat_icone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </span>
            <span class="stat_rotulo">Lucro Anual</span>
            <span class="stat_valor" id="lucro-anual">—</span>
        </div>

        <div class="stat_card">
            <span class="stat_icone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            </span>
            <span class="stat_rotulo">Imposto</span>
            <span class="stat_valor" id="imposto">—</span>
        </div>

        <div class="stat_card">
            <span class="stat_icone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            </span>
            <span class="stat_rotulo">Lucro Desejado</span>
            <span class="stat_valor" id="lucro-desejado">—</span>
        </div>
    </div>

    <div class="resultado_bloco escondido" id="grafico">
        <h3>
            <span class="bloco_icone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </span>
            <span class="bloco_titulo_texto">Gráfico</span>
        </h3>
        <div class="bloco_placeholder">O gráfico da simulação aparecerá aqui.</div>
    </div>

    <div class="resultado_bloco escondido" id="comparacao">
        <h3>
            <span class="bloco_icone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            Comparação com outros do mesmo tipo
        </h3>
        <div class="bloco_placeholder">A comparação com ativos semelhantes aparecerá aqui.</div>
    </div>

    <div class="resultado_bloco escondido" id="info-especificas">
        <h3>
            <span class="bloco_icone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
            </span>
            Informações Específicas
        </h3>
        <div class="bloco_placeholder">Detalhes do ativo selecionado aparecerão aqui.</div>
    </div>

</div>

<script>
    document.getElementById('investment-simulator-form').addEventListener('submit', function (evento) {
        evento.preventDefault();

        document.querySelectorAll('.resultado_bloco').forEach(function (bloco) {
            bloco.classList.remove('escondido');
        });
    });
</script>

<?php

    include __DIR__. '/includes/footer.php'

?>