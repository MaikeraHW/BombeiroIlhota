<?php

require_once __DIR__ . '/../../config/secrets.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit(json_encode([
        "success" => false,
        "message" => "Método inválido."
    ]));
}

$solicitante = $_POST['solicitante'] ?? '';
$data        = $_POST['data_ocorrencia'] ?? '';
$hora        = $_POST['hora_ocorrencia'] ?? '';
$local       = $_POST['local_ocorrencia'] ?? '';
$informacoes = $_POST['informacoes'] ?? '';
$email = $_POST['email'] ?? '';
$terms = (($_POST['termsCheckbox'] ?? '') === "on") ? "Sim" : "Não";
$ocorrenciaId = "OC-" . date("Ymd-His") . "-" . rand(100, 999);

if (
    empty($solicitante) ||
    empty($data) ||
    empty($hora) ||
    empty($local) ||
    empty($email) ||
    empty($informacoes)
) {
    exit(json_encode([
        "success" => false,
        "message" => "Preencha todos os campos."
    ]));
}

$attachment = null;

if(isset($_FILES['documento']) && $_FILES['documento']['error'] === UPLOAD_ERR_OK){

    $permitidos = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"
    ];

    if(!in_array($_FILES['documento']['type'], $permitidos)){
        exit(json_encode([
            "success"=>false,
            "message"=>"Formato de arquivo não permitido."
        ]));
    }

    if($_FILES['documento']['size'] > 10 * 1024 * 1024){
        exit(json_encode([
            "success"=>false,
            "message"=>"Arquivo maior que 10MB."
        ]));
    }

    $attachment = [
        "filename" => $_FILES['documento']['name'],
        "content" => base64_encode(file_get_contents($_FILES['documento']['tmp_name']))
    ];
}

$html = "
<h2>Nova solicitação de ficha</h2>

<table style='border-collapse:collapse' cellpadding='8'>

<tr>
<td><strong>Solicitante:</strong></td>
<td>{$solicitante}</td>
</tr>

<tr>
<td><strong>Email do solicitante:</strong></td>
<td>{$email}</td>
</tr>

<tr>
<td><strong>Data da ocorrência:</strong></td>
<td>{$data}</td>
</tr>

<tr>
<td><strong>Horário aproximado:</strong></td>
<td>{$hora}</td>
</tr>

<tr>
<td><strong>Local da ocorrência:</strong></td>
<td>{$local}</td>
</tr>

<tr>
<td><strong>O termo de ciência foi lido e aceito?</strong></td>
<td>{$terms}</td>
</tr>

</table>

<h3>Informações pertinentes</h3>

<p>{$informacoes}</p>
";

$payload = [
    "from" => "Bombeiros Ilhota <contato@bombeiroilhota.com>",
    "to" => [
        "administrativo@cbvilhota.com"
    ],
    "subject" => "[$ocorrenciaId] Nova ficha solicitada",
    "html" => $html
];

if($attachment){
    $payload["attachments"] = [$attachment];
}

$json = json_encode($payload);

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