<?php
// Proxy seguro para a brapi.dev. O token fica no servidor.
header('Content-Type: application/json; charset=utf-8');

$configFile = __DIR__ . '/config/brapi.local.php';
if (is_file($configFile)) {
    require_once $configFile;
}

$token = getenv('BRAPI_API_KEY');
if (!$token && defined('BRAPI_LOCAL_TOKEN')) {
    $token = trim(BRAPI_LOCAL_TOKEN);
}

if (!$token || $token === 'COLE_SEU_TOKEN_DA_BRAPI_AQUI') {
    http_response_code(500);
    echo json_encode([
        'error' => 'Token da brapi.dev não configurado.',
        'details' => 'Coloque seu token em config/brapi.local.php ou na variável BRAPI_API_KEY.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$ticker = isset($_GET['tickers']) ? strtoupper(trim($_GET['tickers'])) : '';
if (!$ticker || !preg_match('/^[A-Z0-9]+$/', $ticker)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ticker inválido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$url = 'https://brapi.dev/api/quote/' . rawurlencode($ticker);
$headers = [
    'Authorization: Bearer ' . $token,
    'Accept: application/json'
];

$response = false;
$status = 0;
$error = '';

// Preferimos cURL, como recomendado pela documentação da brapi.
if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => $headers
    ]);
    $response = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
} else {
    // Fallback para instalações PHP/XAMPP sem a extensão cURL habilitada.
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => implode("\r\n", $headers),
            'timeout' => 15,
            'ignore_errors' => true
        ]
    ]);
    $response = @file_get_contents($url, false, $context);
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
        $status = (int) $m[1];
    }
}

if ($response === false) {
    http_response_code(502);
    echo json_encode([
        'error' => 'Não foi possível conectar à brapi.dev.',
        'details' => $error ?: 'Verifique sua conexão com a internet e se o PHP permite requisições externas.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code($status ?: 200);
echo $response;
