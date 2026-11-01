<?php

    include __DIR__. '/../includes/head.php';

?>

<?php

    include __DIR__. '/../includes/menu.php';

?>

<div>

    <h1>Tesouro Direto</h1>

    <p>
        O Tesouro Direto é um programa de venda de títulos públicos federais para pessoas físicas. O material-base do projeto separa os títulos em Tesouro Selic, Tesouro IPCA, Tesouro IPCA com juros semestrais, Tesouro Prefixado e Tesouro Prefixado com juros semestrais. <br> 
        Cada título possui uma lógica diferente de remuneração e fluxo de pagamentos. A escolha depende do objetivo, do prazo e da necessidade ou não de receber pagamentos ao longo do caminho. 
    </p>

</div>

<div>

    <H2>Tesouro Selic</H2>

    <P>
        É um título cuja remuneração acompanha a taxa Selic, segundo as condições do título. 
        Costuma ser estudado quando a prioridade é acompanhar a taxa básica de juros e manter uma relação maior com objetivos de liquidez e reserva, observando sempre as condições de resgate.  
    </P>

</div>

<div>

    <H2>Tesouro IPCA</H2>

    <P>
        Combina a variação do IPCA com uma taxa prefixada. A lógica é proteger o poder de compra em relação à inflação, somando uma taxa contratada. 
        É especialmente importante observar o vencimento e a possibilidade de os preços variarem antes do vencimento.
    </P>

</div>

<div>

    <H2>Tesouro IPCA com juros semestrais</H2>

    <P>
        Tem a mesma lógica de remuneração ligada ao IPCA mais uma taxa, mas possui pagamentos periódicos de juros. 
        Esses pagamentos mudam o fluxo de caixa do investimento: parte da remuneração é recebida durante o caminho, e não somente no vencimento.
    </P>

</div>

<div>
    <H2>Tesouro Prefixado</H2>

    <P>
        No Tesouro Prefixado, a taxa é definida na compra. A lógica permite conhecer a taxa contratada para quem mantém o título até o vencimento, dentro das regras do produto. 
    </P>
</div>

<div>

    <H2>Tesouro Prefixado com juros semestrais</H2>

    <P>
        É semelhante ao Prefixado, mas possui pagamentos de juros em períodos definidos. Por isso, é importante entender que receber cupons altera o fluxo de dinheiro ao longo do investimento. 
    </P>
    
</div>


<style>
        table, th, td {
            border: 1px solid white;
            border-collapse: collapse;
            padding: 8px;
        }
    </style>
</head>
<body>

    <table>
        <thead>
            <tr>
                <th>Título</th>
                <th>Logica Principal</th>
                <th>Fluxo</th>
            </tr>
        </thead>
        <tbody>

            <tr>
                <td>Selic</td>
                <td>Acompanha a Selic </td>
                <td>No vencimento/resgate </td>
            </tr>

            <tr>
                <td>IPCA</td>
                <td>IPCA + taxa</td>
                <td>No vencimento</td>
            </tr>

            <tr>
                <td>IPCA com juros semestrais</td>
                <td>IPCA + taxa</td>
                <td>Juros periódicos + principal </td>
            </tr>

            <tr>
                <td>Prefixado</td>
                <td>Taxa definida</td>
                <td>No vencimento</td>
            </tr>

            <tr>
                <td>Prefixado com juros semestrais</td>
                <td>Taxa definida</td>
                <td>Juros periódicos + principal</td>
            </tr>

        </tbody>
    </table>

    <h1>Tesouro Direto — marcação a mercado</h1>

    <p>
        Um ponto importante é que o preço de um título pode variar antes do vencimento. Isso significa que vender antecipadamente pode gerar um resultado diferente daquele imaginado ao simplesmente olhar a taxa contratada.<br> 
        Para quem mantém o título até o vencimento, a análise segue as condições de remuneração previstas. Para quem vende antes, o preço de mercado naquele momento influencia o resultado. 
    </p>

    <h1>Custos </h1>

    <p>
        O Tesouro Direto informa a existência de taxa de custódia da B3 e de eventual taxa cobrada pela instituição financeira. A taxa de custódia da B3 é informada pelo próprio Tesouro Direto como 0,20% ao ano, com regras específicas, incluindo isenção para Tesouro Selic até R$ 10 mil por CPF e cobrança sobre o excedente, conforme a regulamentação vigente. <br>
        As condições de tarifas podem mudar, então é importante conferir a página oficial do Tesouro Direto antes de uma aplicação.
    </p>

    <h1>Objetivos </h1>

    <p>
        O material-base apresenta a ideia de relacionar o título ao objetivo: Selic para objetivos que
        valorizam liquidez e acompanhamento da taxa básica; IPCA para objetivos de longo prazo ligados
        à inflação; Prefixado para quem deseja uma taxa conhecida na contratação; e títulos com juros
        semestrais para quem precisa estudar um fluxo periódico de pagamentos.
    </p>

<?php

    include __DIR__. '/../includes/footer.php';

?>