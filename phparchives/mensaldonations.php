<?php

require_once __DIR__ . '/../../config/secrets.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit(json_encode([
        "success" => false,
        "message" => "Método inválido."
    ]));
}

$name    = $_POST['name'] ?? '';
$tel    = $_POST['tel'] ?? '';
$unit   = $_POST['unit'] ?? '';
$cpf   = $_POST['cpf'] ?? '';
$adress = $_POST['adress'] ?? '';
$casa = $_POST['casa'] ?? '';
$valor = $_POST['valor'] ?? '';
$ocorrenciaId = "SOLIC-" . date("Ymd-His") . "-" . rand(100, 999);

if (
    empty($name) ||
    empty($tel) ||
    empty($unit) ||
    empty($cpf) ||
    empty($adress) ||
    empty($valor)
) {
    exit(json_encode([
        "success" => false,
        "message" => "Preencha todos os campos."
    ]));
}

$attachment = null;


$html = "
<h2>Nova contribuição mensal solicitada</h2>

<table style='border-collapse:collapse' cellpadding='8'>

<tr>
<td><strong>Contribuinte:</strong></td>
<td>{$name}</td>
</tr>

<tr>
<td><strong>Contato do solicitante:</strong></td>
<td>{$tel}</td>
</tr>

<tr>
<td><strong>Unidade Consumidora:</strong></td>
<td>{$unit}</td>
</tr>

<tr>
<td><strong>CPF/CNPJ do responsável</strong></td>
<td>{$cpf}</td>
</tr>

<tr>
<td><strong>Endereço completo:</strong></td>
<td>{$adress}</td>
</tr>

<tr>
<td><strong>Casa própria ou alugada?</strong></td>
<td>{$casa}</td>
</tr>

<tr>
<td><strong>Valor a ser doado mensalmente:</strong></td>
<td>{$valor}</td>
</tr>

</table>

";

$payload = [
    "from" => "Bombeiros Ilhota <contato@bombeiroilhota.com>",
    "to" => [
        "wagner.maiconhenrique@gmail.com"
    ],
    "subject" => "[$ocorrenciaId] Nova contribuição mensal",
    "html" => $html
];

if($attachment){
    $payload["attachments"] = [$attachment];
}

$json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$ch = curl_init("https://api.resend.com/emails");

curl_setopt_array($ch,[
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer ".RESEND_API_KEY,
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => $json
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch,CURLINFO_HTTP_CODE);

if(curl_errno($ch)){
    exit(json_encode([
        "success"=>false,
        "message"=>curl_error($ch)
    ]));
}

curl_close($ch);

echo json_encode([
    "success"=>$httpCode >=200 && $httpCode <300,
    "message"=>$httpCode >=200 && $httpCode <300
        ? "Solicitação enviada com sucesso!"
        : "Erro ao enviar Solicitação.",
    "resposta"=>json_decode($response,true)
]);