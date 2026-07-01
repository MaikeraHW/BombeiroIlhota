<?php

require_once __DIR__ . '/../../config/config.php';

$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if (!$conn) {
    die("Erro na conexão: " . mysqli_connect_error());
}

$id = (int)($_GET['id'] ?? 0);

$sql = "SELECT * FROM noticias WHERE id = $id LIMIT 1";
$result = mysqli_query($conn, $sql);

if (!$result || mysqli_num_rows($result) == 0) {
    die("Notícia não encontrada.");
}

$noticia = mysqli_fetch_assoc($result);

?>

<!DOCTYPE html>
<html lang="pt-br">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><?= htmlspecialchars($noticia['titulo']) ?></title>

    <link rel="icon" href="/src/icons/brasaoCBVI.png">

    <link rel="stylesheet" href="/styles/globalStyles.css">
    <link rel="stylesheet" href="/styles/headerStyles.css">
    <link rel="stylesheet" href="/styles/footerStyles.css">
    <link rel="stylesheet" href="/styles/noticiaStyles.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

</head>

<body>

<div data-component="header" class="header"></div>

<main class="newsPage">

    <section class="newsHero">

        <img
            src="<?= htmlspecialchars($noticia['imagem_principal']) ?>"
            alt="<?= htmlspecialchars($noticia['titulo']) ?>"
        >

    </section>

    <article class="newsContent">

        <a href="/" class="backButton">
            ← Voltar para notícias
        </a>

        <span class="newsDate">
            <?= date('d/m/Y', strtotime($noticia['data'])) ?>
        </span>

        <h1>
            <?= htmlspecialchars($noticia['titulo']) ?>
        </h1>

        <div class="divider"></div>

        <div class="newsText">

            <?= nl2br(htmlspecialchars($noticia['texto'])) ?>

        </div>

    </article>

</main>

<div data-component="footer"></div>

<script src="/scripts/fetch.js"></script>

</body>

</html>