<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: private, max-age=30');
$symbols = strtoupper(trim($_GET['symbols'] ?? ''));
if (!preg_match('/^[A-Z0-9]{4,7}(,[A-Z0-9]{4,7}){0,9}$/', $symbols)) { http_response_code(400); echo json_encode(['error'=>'Símbolos inválidos']); exit; }
$range = in_array($_GET['range'] ?? '', ['1mo','3mo','6mo','1y'], true) ? $_GET['range'] : '1mo';
$url = 'https://brapi.dev/api/quote/' . rawurlencode($symbols) . '?range=' . $range . '&interval=1d';
require_once __DIR__ . '/../config/brapi.local.php';
$token = getenv('BRAPI_TOKEN') ?: (defined('BRAPI_LOCAL_TOKEN') ? BRAPI_LOCAL_TOKEN : '');
$ch = curl_init($url);
$headers = ['Accept: application/json'];
if ($token) $headers[] = 'Authorization: Bearer ' . $token;
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>12,CURLOPT_CONNECTTIMEOUT=>5,CURLOPT_FOLLOWLOCATION=>false,CURLOPT_HTTPHEADER=>$headers]);
$result = curl_exec($ch); $status = curl_getinfo($ch, CURLINFO_HTTP_CODE); $err = curl_error($ch); curl_close($ch);
if ($result === false || !$status) { http_response_code(502); echo json_encode(['error'=>'Serviço de cotações indisponível', 'detail'=>$err]); exit; }
http_response_code($status >= 200 && $status < 300 ? 200 : 502);
if ($status >= 200 && $status < 300 && json_decode($result, true) !== null) echo $result;
else echo json_encode(['error'=>'A Brapi não respondeu com dados válidos', 'upstream_status'=>$status]);
