<?php
// Configuração do banco (Hostinger)
require_once 'config.php';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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
    $sql = "INSERT INTO volunteers 
            (name, cpf, email, phone, city, birth, accept)
            VALUES
            (:name, :cpf, :email, :phone, :city, :birth, :accept)";

    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':cpf', $cpf);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $tel);
    $stmt->bindParam(':city', $city);
    $stmt->bindParam(':birth', $birth);
    $stmt->bindParam(':accept', $accept);

    $stmt->execute();

    echo "Inscrição enviada com sucesso!";

} catch (PDOException $e) {
    echo "Erro ao salvar: " . $e->getMessage();
}
?>