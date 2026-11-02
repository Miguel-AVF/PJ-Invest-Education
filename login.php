<?php

    session_start();
    require_once 'config/database.php';

    $msg = '';

    if(isset($_POST['entrar'])){

        
        $senha = $_POST['senha'];

        $sql = "SELECT * FROM usuario WHERE (email_user = :login OR nome_user = :login)";

        $stmt = $conn->prepare($sql);

        
        $stmt->bindValue(':login', trim($_POST['login'] ?? ''));

        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if($user && (password_verify($senha, $user['senha_user']) || hash_equals((string)$user['senha_user'], (string)$senha))){
            session_regenerate_id(true);

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
            <?= htmlspecialchars($msg, ENT_QUOTES, "UTF-8") ?>
        </div>
        <?php endif; ?>

    <div class="login-box func-card" id="login-panel">
        
        <div class="login-logo">
            <div style="width:60px;height:60px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 12px"></div>
            <h1 style="font-size: 2rem; font-weight: bold; line-height: 1.2;">Dusk <span style="color: #FFD700;">Invest Education</span></h1>
            <p>Seja Bem Vindo</p>
        </div>
        
        <div class="login-error" id="login-error"></div>
        
        <form method="post" action="login.php">
        <label class="login-label">E-mail</label>
        <input type="email" class="login-input" id="login-email" name="login" required placeholder="" value="">
        
        <label class="login-label">Senha</label>
        <input type="password" class="login-input" id="login-pass" name="senha" required placeholder="" value="">
        
       <button type="submit" name="entrar" class="login-btn">Entrar</button>
        </form>
        
        <a href="cadastro.php" style="color: #B8860B; text-decoration: none;">
            <strong>Criar conta</strong>
        </a>

    </div>

</div>

</body>
</html>