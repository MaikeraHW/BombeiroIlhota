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
$imagem = $noticia['imagem_principal'] ?? '';

$sqlLeiaTambem = "
    SELECT id, titulo
    FROM noticias
    WHERE id != ?
    ORDER BY data DESC
    LIMIT 10
";

$stmtLeiaTambem = mysqli_prepare($conn, $sqlLeiaTambem);
mysqli_stmt_bind_param($stmtLeiaTambem, "i", $id);
mysqli_stmt_execute($stmtLeiaTambem);

$resultLeiaTambem = mysqli_stmt_get_result($stmtLeiaTambem);

?>

<!DOCTYPE html>
<html lang="pt-br">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title> <?= htmlspecialchars($noticia['titulo']) ?> </title>

    <link rel="icon" href="/src/icons/brasaoCBVI.png">

    <link rel="stylesheet" href="/styles/globalStyles.css">
    <link rel="stylesheet" href="/styles/headerStyles.css">
    <link rel="stylesheet" href="/styles/footerStyles.css">
    <link rel="stylesheet" href="noticiaStyles.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

</head>

<body>

<div data-component="header" class="header"></div>

<main class="newsPage">

    <div class="newsListBlock">
        
    <?php if (mysqli_num_rows($resultLeiaTambem) > 0): ?>
        <h3>Leia também</h3>
            <ul class="newList">
                <?php while ($item = mysqli_fetch_assoc($resultLeiaTambem)): ?>
                    <li class="newListItem">
                        <a href="/news/?id=<?= $item['id'] ?>" class="newsBarLink"> <?= htmlspecialchars($item['titulo']) ?> </a>
                    </li>
                <?php endwhile; ?>
            </ul>
    <?php endif; ?>
    </div>
    <div class="mainNewBlock">
        <h2 class="newsTitle"> <?= htmlspecialchars($noticia['titulo']) ?> </h2>
        <h4 class="newsDate"><?= htmlspecialchars($noticia['data']) ?></h4>
        <img src="/<?= htmlspecialchars($imagem) ?>" alt="<?= htmlspecialchars($noticia['titulo']) ?>" class="bannerNews">


        <p class="newsText"> <?= htmlspecialchars($noticia['texto']) ?> </p>
        <a href="/" class="backButton">← Voltar a Home</a>
    </div>
</main>

<div data-component="footer"></div>

<script src="/scripts/fetch.js"></script>
</body>
</html>