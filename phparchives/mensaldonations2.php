<?php

require_once __DIR__ . '/../../config/secrets.php';

header('Content-Type: application/json');

// valida método
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Método inválido"
    ]);
    exit;
}

// dados do form
$name    = $_POST['name'] ?? '';
$tel    = $_POST['tel'] ?? '';
$unit   = $_POST['unit'] ?? '';
$cpf   = $_POST['cpf'] ?? '';
$adress = $_POST['adress'] ?? '';
$casa = 'COMO PEGAR VALOR DA CASA'?
$valor = $_POST['valor'] ?? '';

// valida campos
if (!$name || !$tel || !$unit || !$cpf || !$adress || !$casa || !$valor) {
    echo json_encode([
        "success" => false,
        "message" => "Preencha todos os campos."
    ]);
    exit;
}

// pega API KEY corretamente do secrets.php
$apiKey = trim(RESEND_API_KEY);

// payload Resend
$payload = [
    "from" => "Bombeiros Ilhota <contato@bombeiroilhota.com>",
    "to" => ["wagner.maiconhenrique@gmail.com"],
    "reply_to" => $email,
    "subject" => "Novo contato do site",
    "html" => "
        <h2>Novo contato recebido</h2>
        <p><strong>Nome:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Mensagem:</strong><br>{$message}</p>
    "
];

$json = json_encode($payload);

// CURL (UMA SÓ VEZ)
$ch = curl_init("https://api.resend.com/emails");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $apiKey,
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $json);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo json_encode([
        "success" => false,
        "message" => curl_error($ch)
    ]);
    exit;
}

curl_close($ch);

// resposta final
echo json_encode([
    "success" => $httpCode >= 200 && $httpCode < 300,
    "message" => $httpCode >= 200 && $httpCode < 300
        ? "Mensagem enviada com sucesso!"
        : "Erro ao enviar mensagem",
    "resend" => json_decode($response, true)
]);