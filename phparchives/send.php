<?php

$apiKey = "re_Y95nMbqN_JzsQQNmrs3v3Y3tVv76RQL5b";

$name    = $_POST['name'] ?? '';
$email   = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';

if (!$name || !$email || !$message) {
    die("Preencha todos os campos.");
}

$payload = [
    "from" => "contato@bombeiroilhota.com",
    "to" => ["wagner.maiconhenrique@gmail.com"],
    "subject" => "Novo contato do site",
    "html" => "
        <h2>Novo contato recebido</h2>
        <p><strong>Nome:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Mensagem:</strong><br>{$message}</p>
    "
];

$json = json_encode($payload);

$ch = curl_init("https://api.resend.com/emails");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $json);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo "Erro cURL: " . curl_error($ch);
    exit;
}

curl_close($ch);

echo "HTTP: $httpCode\n";
echo "Resposta: $response";