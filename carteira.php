<?php

    include __DIR__. '/includes/head.php';

?>

<?php

    include __DIR__. '/includes/menu.php';

?>

<?php

    session_start();

    $usuarioLogado = isset($_SESSION['usuario_id']);

?>

<div class="carteira_intro">
    <h1>Minha Carteira</h1>
    <p>Os ativos que você salvar no <a href="simula.php">Simulador</a> aparecem aqui, com cotação/taxa sempre atualizada. Fica guardado neste navegador.</p>
</div>

<div class="carteira_container">

    <div class="bloco_placeholder escondido" id="carteira-vazia">
        Sua carteira ainda está vazia. Vá até o <a href="simula.php">Simulador</a>, escolha um ativo, simule e clique em "Salvar na Carteira".
    </div>

    <div class="carteira_lista" id="carteira-lista"></div>

</div>

<script src="https://unpkg.com/lightweight-charts@4.2.2/dist/lightweight-charts.standalone.production.js"></script>
<script src="scripts/api-config.js"></script>
<script src="scripts/carteira.js"></script>
<script src="scripts/carteira-pagina.js"></script>


<div class="conteudo">

    <div class="video">
        <iframe
            src="https://www.youtube.com/embed/BXTAuLDZkpo?si=VBuJ3NFcq3_LhvhM&amp;start=32"
            title="YouTube video player"
            allowfullscreen>
        </iframe>
    </div>

    <div class="planilha">

        <h2>Organize suas finanças!</h2>
        <p>
            <b>Precisa de ajuda para organizar seus gastos?</b>
            <br>
            Baixe a planilha abaixo ⬇
        </p>

        <a href="downloads/Planilha de Organização Financeira do Primo Pobre - Versão 2026.xlsx"
           class="botao-download"
           download>
            <img src="image/download-icon.svg" alt="Ícone download">
            Baixar planilha
        </a>

    </div>

</div>


<?php

    include __DIR__. '/includes/footer.php';

?>
