<?php

    include __DIR__. '/includes/head.php';

?>

<?php

    include __DIR__. '/includes/menu.php';

?>


<?php

    session_start();
    
    if (isset($_SESSION['mensagem_welcome'])) {
        $msg_welcome = $_SESSION['mensagem_welcome'];
        echo "<script>alert('$msg_welcome');</script>";
        
        unset($_SESSION['mensagem_welcome']);
    }

?>

    <section class="fundo">
        <div class="apresentação">
            <h1>Dusk Invest Education</h1>
            <p>O <b>Dusk Invest Education</b> tem como objetivo apresentar conceitos fundamentais de educação financeira e ensinar, de forma acessível, como iniciar no mundo dos investimentos. Desde o planejamento financeiro
            pessoal até a análise de diferentes tipos de investimentos, como renda fixa e variável. Elaboração de um guia prático voltado para iniciantes. Como resultado, espera-se
            contribuir para a conscientização financeira e auxiliar indivíduos na tomada de decisões mais seguras e eficientes.</p>
        </div>
    </section>

    <section class="funções">
        <div class="sub_titulo">
            <h2>Funções</h2>
        </div>

        <div class="func-grid">

            <div class="func-card">
                <div class="func-imagem">
                    <img src="image/carteira.png" alt="Carteira">
                    
                </div>
                <div class="func-inform">
                    <h3 class="h3">Carteira</h3>
                    <p class="descrição">Acompanhe seu Crescimento</p>
                    <a href="carteira.php" class="botão"> Veja Agora </a>
                </div>
            </div>

            <div class="func-card">
                <div class="func-imagem">
                    <img src="image/inform.jpeg" alt="Informação">
                    
                </div>
                <div class="func-inform">
                    <h3 class="h3">Informações</h3>
                    <p class="descrição">Tire duvidas com textos Simples</p>
                    <a href="informa.php" class="botão">Veja Agora</a>
                </div>
            </div>

            <div class="func-card">
                <div class="func-imagem">
                    <img src="image/simula.png" alt="Simulação">
                    
                </div>
                <div class="func-inform">
                    <h3 class="h3">Simulações</h3>
                    <p class="descrição">Aprenda na Pratica</p>
                    <a href="simula.php" class="botão" > Veja Agora </a>
                </div>
            </div>
        </div>
    </section>

<?php

    include __DIR__. '/includes/footer.php';

?>