<?php

    require_once 'config/database.php';

    $msg = '';

    if(isset($_POST['cadastrar'])){

        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $senha = $_POST['senha'];
        $data = $_POST['data'];
        $tel = $_POST['telefone'];

        $sql = "INSERT INTO usuario
        (nome_user, email_user, senha_user, data_nasc_user,  tel_user)
        VALUES
        (:nome,:email,:senha,:data,:tel)";

        $stmt = $conn->prepare($sql);

        $stmt->bindValue(':nome',$nome);
        $stmt->bindValue(':email',$email);
        $stmt->bindValue(':senha',$senha);
        $stmt->bindValue(':data',$data);
        $stmt->bindValue(':tel',$tel);

        if($stmt->execute()){
            $msg = "Cadastro realizado com sucesso!";
        }

    }

?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Cadastro</title>
<link rel="stylesheet" href="styles/style.css">
</head>
<body>

<div class="login-wrapper">
    <div class="login-box func-card" id="register-panel">
        
        <div class="login-logo">

            <div style="width:60px;height:60px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 12px"></div>
            <h1 style="font-size: 2rem; font-weight: bold; line-height: 1.2;">Dusk <span style="color: #FFD700;">Invest Education</span></h1>
            <p>Criar Conta</p>
            
        </div>

        <?php if(!empty($msg)): ?>

        <div class="login-error" style="display: block;">
            <?= $msg ?>
        </div>

        <?php endif; ?>

        <form method="POST" class="horizontal-form">
    
    <div class="form-row title-row">
        <div class="form-group title-group">
            <div class="title-toggle">
                <input type="radio" id="sr" name="tratamento" value="Sr" checked>
                <label for="sr">Sr.</label>

                <input type="radio" id="sra" name="tratamento" value="Sra">
                <label for="sra">Sra.</label>
            </div>
        </div>
    </div>

    <div class="form-row">
        <div class="form-group">
            <label class="login-label">Nome Completo</label>
            <input type="text" name="nome" class="login-input" placeholder="" required>
        </div>

        <div class="form-group">
            <label class="login-label">E-mail</label>
            <input type="email" name="email" class="login-input" placeholder="" required>
        </div>
    </div>

    <div class="form-row">
        <div class="form-group">
            <label class="login-label">Senha</label>
            <input type="password" name="senha" class="login-input" placeholder="" required>
        </div>

        <div class="form-group">
            <label class="login-label">Data de Nascimento</label>
            <input type="date" name="data" class="login-input" required>
        </div>
    </div>

    <div class="form-row">
        <div class="form-group full-width">
            <label class="login-label">Telefone</label>
            <input type="text" name="telefone" class="login-input" placeholder="">
        </div>
    </div>

    <button type="submit" name="cadastrar" class="login-btn">
        Cadastrar
    </button>

</form>

        <div class="login-hint">
            Já tem conta? <a href="login.php" style="color: #B8860B; text-decoration: none;"><strong>Entrar</strong></a>
        </div>

    </div>

</div>

