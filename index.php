<?php
require_once __DIR__ . '/../config/config.php';

$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if (!$conn) {
    die("Erro na conexão: " . mysqli_connect_error());
}

$sql = "SELECT * FROM noticias ORDER BY data DESC";
$result = mysqli_query($conn, $sql);
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/styles/globalStyles.css">
    <link rel="stylesheet" href="/styles/headerStyles.css">
    <link rel="stylesheet" href="/styles/footerStyles.css">
    <link rel="stylesheet" href="/homeStyles.css">

    <link rel="icon" type="image/png" href="/src/icons/brasaoCBVI.png">

    <title>Bombeiros Voluntários de Ilhota</title>
</head>

<body class="body">

    <!-- HEADER -->
    <div data-component="header" class="header"></div>

    <!-- HERO -->
    <hero class="herobanner">
        <div class="hero-slider">
            <div class="slides">

                <div class="slide active">
                    <div class="peliculaHolder">
                        <img src="/src/pic1.jpg" alt="">
                        <h2 class="banner1Text">Bombeiros Voluntários<br> de Ilhota</h2>
                    </div>
                </div>

                <div class="slide">
                    <div class="peliculaHolder">
                        <img src="/src/pic3.jpg" alt="">
                        <h2 class="banner2Text">24 horas por dia</h2>
                    </div>
                </div>

                <div class="slide">
                    <div class="peliculaHolder">
                        <img src="/src/pic2.jpeg" alt="">
                        <h2 class="banner3Text">365 dias por ano</h2>
                    </div>
                </div>

                <div class="slide">
                    <div class="peliculaHolder">
                        <img src="/src/pic4.jpg" alt="">
                        <h2 class="banner4Text">Prontos para salvar vidas</h2>
                    </div>
                </div>

            </div>
        </div>
    </hero>

    <!-- MAIN -->
    <main class="homeContent">

        <!-- STATISTICS -->
        <section class="homeStatisticSection">
            <article class="homeStatisticArticle">
                <h2 class="homeStatisticTitle">Relatório de Atendimentos</h2>
                <h3 class="homeStatisticSubTitle">Maio de 2026</h3>

                <div class="homeStatisticsHolder">

                    <div class="homeStatisticsInside">
                        <div class="homeStatisticItem topLeft">
                            <div class="iconHolder">
                                <img src="/src/icons/paramedic.png">
                            </div>
                            <div class="itemContent">
                                <h3 class="itemTitle">APH</h3>
                                <p>143</p>
                            </div>
                        </div>

                        <div class="homeStatisticItem topRight">
                            <div class="iconHolder">
                                <img src="/src/icons/traffic.png">
                            </div>
                            <div class="itemContent">
                                <h3 class="itemTitle">Sinistros de Trânsito</h3>
                                <p>28</p>
                            </div>
                        </div>
                    </div>

                    <div class="homeStatisticsInside">
                        <div class="homeStatisticItem bottomLeft">
                            <div class="iconHolder">
                                <img src="/src/icons/firefighter.png">
                            </div>
                            <div class="itemContent">
                                <h3 class="itemTitle">Resgates Diversos</h3>
                                <p>19</p>
                            </div>
                        </div>

                        <div class="homeStatisticItem">
                            <div class="iconHolder">
                                <img src="/src/icons/fire-brigade.png">
                            </div>
                            <div class="itemContent">
                                <h3 class="itemTitle">Incêndios</h3>
                                <p>6</p>
                            </div>
                        </div>
                    </div>

                    <div class="homeStatisticsResume">
                        <h2 class="homeStatisticResumeText">Total:</h2>
                        <p class="homeStatisticResumeNum">196</p>
                    </div>

                </div>
            </article>
        </section>

        <!-- NEWS -->
        <section class="homeNewsSection">

            <h2>Notícias</h2>
            <div class="homeNewsHolder">
                <section class="news-carousel">
                    <div class="news-carousel-wrapper">

                    <button class="news-btn prev">&#10094;</button>
                    <section class="news-carousel">
                        <div class="carousel-track">
                        <?php while ($row = mysqli_fetch_assoc($result)) { ?>
                            <a href="/noticias/noticia.php?id=<?= $row['id'] ?>" class="news-card"
                                style="background-image: url('<?= $row['imagem_principal'] ?>');">
                                <div class="news-date">
                                    <?= date('d/m/Y', strtotime($row['data'])) ?> 
                                </div>
                                <h3 class="news-title"> <?= $row['titulo'] ?> </h3>
                            </a>
                        <?php } ?>
                     </div>
                    </section>
                     <button class="news-btn next">&#10095;</button>
                </section>
            </div>
        </section>

    </main>

    <!-- FOOTER -->
    <div data-component="footer"></div>

    <script src="scripts/fetch.js"></script>
    <script src="scripts/home.js"></script>

</body>

</html>