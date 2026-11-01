<!--
    <header class="main-header">
        <div class="logo">DUSK <span class="logot">INVEST EDUCATION</span></div>
        <nav class="nav-menu">
            <a href="index.php">Inicio</a>
            <a href="informa.php">Informativo</a>
            <a href="simula.php">Simulador</a>
            <a href="sobre.php">Sobre Nós</a> 
            <a href="carteira.php">Carteira</a>
        </nav>

        <div class="search-bar">
            <form action="informa.php" method="GET" autocomplete="off">
                <input type="text" placeholder="Buscar no site..." name="q">
                <button type="submit"><i class="fas fa-search"></i><img src="image/search.svg" alt="Lupa" style="filter: invert(1);"></button>
            </form>
        </div>

        <nav class="nav-menu">
            <a href="logoult.php">Sair</a>
        </nav>

        <div class="user-profile">
            <a href="cadastro.php"><img src="image/pfp.avif" alt="Foto de Perfil" ></a>
        </div>
    </header>

    <script src="scripts/busca.js"></script>
-->

<header class="main-header">
    <div class="logo">
        DUSK <span class="logot">INVEST EDUCATION</span>
    </div>

    <nav class="nav-menu">
        <a href="<?= BASE_URL ?>index.php">Inicio</a>
        <a href="<?= BASE_URL ?>informa.php">Informativo</a>
        <a href="<?= BASE_URL ?>simula.php">Simulador</a>
        <a href="<?= BASE_URL ?>sobre.php">Sobre Nós</a>
        <a href="<?= BASE_URL ?>carteira.php">Carteira</a>
    </nav>

    <div class="search-bar">
        <form action="<?= BASE_URL ?>informa.php" method="GET" autocomplete="off">
            <input type="text" placeholder="Buscar no site..." name="q">

            <button type="submit">
                <i class="fas fa-search"></i>
                <img src="<?= BASE_URL ?>image/search.svg"
                     alt="Lupa"
                     style="filter: invert(1);">
            </button>
        </form>
    </div>

    <nav class="nav-menu">
        <a href="<?= BASE_URL ?>logoult.php">Sair</a>
    </nav>

    <div class="user-profile">
        <a href="<?= BASE_URL ?>cadastro.php">
            <img src="<?= BASE_URL ?>image/pfp.avif" alt="Foto de Perfil">
        </a>
    </div>
</header>

<script src="<?= BASE_URL ?>scripts/busca.js"></script>

<!-- Por alguma razão esse código funciona ara os arquivos do informs-->