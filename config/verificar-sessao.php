<?php
// Confirma a sessão no servidor, sem confiar em variáveis do navegador.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
$usuario = $_SESSION['id_user'] ?? null;
echo json_encode(['autenticado' => !empty($usuario), 'usuario' => $usuario]);
