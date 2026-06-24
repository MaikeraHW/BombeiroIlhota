<?php
header('Content-Type: application/json');

try {
    // conexão com banco
    require_once '/phparchives/config.php';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // dados do formulário
    $name = $_POST['name'] ?? '';
    $start = $_POST['start'] ?? '';
    $end = $_POST['end'] ?? '';
    $jaqueta = $_POST['jaqueta'] ?? '';
    $calca = $_POST['calca'] ?? '';
    $bota = $_POST['bota'] ?? '';
    $question = $_POST['question'] ?? '';
    $signature = $_POST['signature'] ?? '';

    if (!$name || !$signature) {
        echo json_encode([
            'success' => false,
            'message' => 'Dados obrigatórios não enviados.'
        ]);
        exit;
    }

    // salvar no banco
    $sql = "INSERT INTO registros_epi 
            (nome, horario_inicio, horario_fim, jaqueta, calca, bota, condicao_uso, assinatura)
            VALUES
            (:nome, :inicio, :fim, :jaqueta, :calca, :bota, :condicao, :assinatura)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nome' => $name,
        ':inicio' => $start,
        ':fim' => $end,
        ':jaqueta' => $jaqueta,
        ':calca' => $calca,
        ':bota' => $bota,
        ':condicao' => $question,
        ':assinatura' => $signature
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Registro salvo com sucesso.'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}