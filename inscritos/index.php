<?php
require_once __DIR__ . '/../../config/config.php';

try {
    $pdo = new PDO(
    "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
    DB_USER,
    DB_PASS
);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT name, tel FROM inscritos ORDER BY id DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Erro: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Lista de Inscritos</title>

    <style>
        body {
            font-family: Arial;
            padding: 20px;
        }

        .card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            border-radius: 8px;
        }

        .btn {
            background: #25D366;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>

<h2>Inscritos</h2>

<?php foreach ($users as $user): ?>

<?php
    $nome = $user['name'];

    // limpa telefone (remove tudo que não for número)
    $tel = preg_replace('/\D/', '', $user['tel']);

    // garante Brasil (55)
    if (strlen($tel) == 11 || strlen($tel) == 10) {
        $tel = "55" . $tel;
    }

    $msg = urlencode("Olá $nome! Vimos sua inscrição no curso dos Bombeiros Voluntários.");
?>

<div class="card">
    <div>
        <strong><?= htmlspecialchars($nome) ?></strong><br>
        <?= htmlspecialchars($user['tel']) ?>
    </div>

    <a class="btn"
       href="https://wa.me/<?= $tel ?>?text=<?= $msg ?>"
       target="_blank">
        WhatsApp
    </a>
</div>

<?php endforeach; ?>

</body>
</html>