<?php
header('Content-Type: application/json');

try {
    // conexão com banco
    require_once 'config.php';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // dados do formulário
    $name = $_POST['name'] ?? '';
    $start = $_POST['start_time'] ?? '';
    $end = $_POST['end_time'] ?? '';
    $jaqueta = $_POST['jaqueta'] ?? '';
    $calca = $_POST['calca'] ?? '';
    $bota = $_POST['bota'] ?? '';
    $question = $_POST['condition_ok'] ?? '';
    $signature = $_POST['signature'] ?? '';

    if (!$name || !$signature) {
        echo json_encode([
            'success' => false,
            'message' => 'Dados obrigatórios não enviados.'
        ]);
        exit;
    }

    // ==========================================
    // 🔥 CONVERSÃO BASE64 → ARQUIVO PNG
    // ==========================================

    $signature = str_replace('data:image/png;base64,', '', $signature);
    $signature = str_replace(' ', '+', $signature);

    $imageData = base64_decode($signature);

    // nome único do arquivo
    $fileName = 'assinatura_' . date('Ymd_His') . '_' . uniqid() . '.png';

    // pasta onde será salvo
    $folderPath = __DIR__ . '/uploads/assinaturas/';

    // cria pasta se não existir
    if (!file_exists($folderPath)) {
        mkdir($folderPath, 0777, true);
    }

    // caminho completo do arquivo
    $filePath = $folderPath . $fileName;

    // salva arquivo físico
    file_put_contents($filePath, $imageData);

    // caminho que será salvo no banco
    $signaturePath = 'uploads/assinaturas/' . $fileName;

    // ==========================================
    // INSERT NO BANCO
    // ==========================================

    $sql = "INSERT INTO registros_epi 
            (nome, horario_inicio, horario_fim, jaqueta, calca, bota, condicao_uso, assinatura_path)
            VALUES
            (:nome, :inicio, :fim, :jaqueta, :calca, :bota, :condicao, :assinatura_path)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nome' => $name,
        ':inicio' => $start,
        ':fim' => $end,
        ':jaqueta' => $jaqueta,
        ':calca' => $calca,
        ':bota' => $bota,
        ':condicao' => $question,
        ':assinatura_path' => $signaturePath
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