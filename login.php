<?php

    session_start();
    require_once 'config/database.php';

    $msg = '';

    if(isset($_POST['entrar'])){

        
        $senha = $_POST['senha'];

        $sql = "SELECT * FROM usuario
                WHERE nome_user = :login
                AND senha_user = :senha";

        $stmt = $conn->prepare($sql);

        
        $stmt->bindValue(':senha',$senha);

        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if($user){

            $_SESSION['id_user'] = $user['id_user'];
            $_SESSION['nome_user'] = $user['nome_user'];

            header("Location: index.php");
            exit;

        }else{

            $msg = "Login inválido";

        }
    }

?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles/style.css">
    <title>Login</title>
</head>
<body>
    
<div class="login-wrapper">

    <?php if(!empty($msg)): ?>
        <div class="mensagem">
            <?= $msg ?>
        </div>
        <?php endif; ?>

    <div class="login-box func-card" id="login-panel">
        
        <div class="login-logo">
            <div style="width:60px;height:60px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 12px"></div>
            <h1 style="font-size: 2rem; font-weight: bold; line-height: 1.2;">Dusk <span style="color: #FFD700;">Invest Education</span></h1>
            <p>Seja Bem Vindo</p>
        </div>
        
        <div class="login-error" id="login-error"></div>
        
        <label class="login-label">E-mail</label>
        <input type="email" class="login-input" id="login-email" placeholder="" value="">
        
        <label class="login-label">Senha</label>
        <input type="password" class="login-input" id="login-pass" placeholder="" value="">
        
       <a href="index.php" class="login-btn">Entrar</a>
        
        <a href="cadastro.php" style="color: #B8860B; text-decoration: none;">
            <strong>Criar conta</strong>
        </a>

    </div>

</div>

</body>
</html>