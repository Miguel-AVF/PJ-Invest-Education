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
            <option value="">Tesouro Selic</option>
            <option value="">Tesouro IPCA</option>
            <option value="">Tesouro IPCA com Juros Semestrais</option>
            <option value="">Tesouro Prefixado</option>
            <option value="">Tesouro Prefixado com Juros Semestrais</option>

            <option value="">CDB 100% do CDI com liquidez diária</option>
            <option value="">CDB 105% do CDI</option>
            <option value="">CDB 110% do CDI</option>
            <option value="">CDB prefixado</option>
            <option value="">CDB IPCA + taxa fixa</option>

            <option value="">LCI 90% do CDI</option>
            <option value="">LCI 95% do CDI</option>
            <option value="">LCI 100% do CDI</option>
            <option value="">LCI Prefixado</option>
            <option value="">LCI IPCA + Taxa Fixa</option>

            <option value="">LCA 90% do CDI</option>
            <option value="">LCA 95% do CDI</option>
            <option value="">LCA 100% do CDI</option>
            <option value="">LCA prefixado</option>
            <option value="">LCA IPCA + taxa fixa</option>

            <option value="">PETR4 - Petrobras</option>
            <option value="">VALE3 - Vale</option>
            <option value="">ITUB4 - Itaú Unibanco</option>
            <option value="">PRIO3 - Prio</option>
            <option value="">B3SA3 - B3</option>

            <option value="">CPLG11 - Capitania Logística</option>
            <option value="">BTLG11 - BTG Pactual Logística</option>
            <option value="">TRXF11 - TRX Real Estate</option>
            <option value="">XPML11 - XP Malls</option>
            <option value="">HGLG11 - Patria Logistica</option>

            <option value="">BTC - Bitcoin</option>
            <option value="">ETH - Ethereum</option>
            <option value="">USDT - Tether</option>
            <option value="">BNB - BNB</option>
            <option value="">SOL - Solana</option>
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


<div>
    <!-- Lucro Mensal -->
</div>

<div>
    <!-- Lucro Anual -->
</div>

<div>
    <!-- Imposto -->
</div>

<div>
    <!-- Lucro Desejado -->
</div>

<div>
    <!-- Grafico -->
</div>

<div>
    <!-- Comparação com outros do mesmo tipo -->
</div>

<div>
    <!-- Informações Especificas -->
</div>


<?php

    include __DIR__. '/includes/footer.php'

?>