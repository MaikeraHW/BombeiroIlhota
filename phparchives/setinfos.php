<?php
// Configuração do banco (Hostinger)
require_once __DIR__ . '/../../config/config.php';

header('Content-Type: application/json');

try {
    $pdo = new PDO(
    "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
    DB_USER,
    DB_PASS
);

    // Captura dados do form
    $name  = $_POST['name'] ?? '';
    $cpf   = $_POST['cpf'] ?? '';
    $email = $_POST['email'] ?? '';
    $tel   = $_POST['tel'] ?? '';
    $city  = $_POST['city'] ?? '';
    $birth = $_POST['birth'] ?? '';
    $accept = isset($_POST['accept']) ? 1 : 0;


    // Validação simples
    if (!$name || !$cpf || !$email || !$tel || !$city || !$birth) {
    die("Preencha todos os campos obrigatórios.");
    }

    // SQL seguro (prepared statement)
    $sql = "INSERT INTO inscritos 
            (name, cpf, email, tel, city, birth, accept)
            VALUES
            (:name, :cpf, :email, :tel, :city, :birth, :accept)";

    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':cpf', $cpf);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':tel', $tel);
    $stmt->bindParam(':city', $city);
    $stmt->bindParam(':birth', $birth);
    $stmt->bindParam(':accept', $accept);

    $stmt->execute();

    echo json_encode([
        "status" => "success",
        "message" => "Inscrição enviada com sucesso!"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Erro ao salvar"
    ]);
}
?>