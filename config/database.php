<?php
    
    $host="localhost";
    $user="root";
    $password="root";
    $port=3306;
    $database="Dusk";

    try{

    $conn=new PDO('mysql:host='.$host.';port='.$port.';dbname='.$database,$user,$password);
    $conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
    }catch(PDOException $e){
        error_log('Erro ao conectar ao banco: ' . $e->getMessage());
        http_response_code(503);
        exit('Banco de dados indisponível. Verifique a configuração do servidor.');
    }
?>