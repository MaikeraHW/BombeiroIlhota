<?php
    
require_once __DIR__ . '/../../../config/config.php';

$busca = trim($_GET['busca'] ?? '');

try {
    $pdo = new PDO(
    "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
    DB_USER,
    DB_PASS
);

    if ($busca !== '') {
        $sql = "SELECT id, nome, jaqueta, calca, bota, capacete, condicao_uso, assinatura_path, criado_em
                FROM registros_epi
                WHERE jaqueta LIKE :busca
                   OR calca LIKE :busca
                   OR bota LIKE :busca
                   OR capacete LIKE :busca
                ORDER BY criado_em DESC
                LIMIT 20";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':busca' => "%{$busca}%"
        ]);
    } else {
        $sql = "SELECT id, nome, jaqueta, calca, bota, capacete, condicao_uso, assinatura_path, criado_em
                FROM registros_epi
                ORDER BY criado_em DESC
                LIMIT 20";

        $stmt = $pdo->query($sql);
    }

    $registros = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (Exception $e) {
    die("Erro ao buscar registros: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consulta de Registros EPI</title>
    <link rel="stylesheet" href="listar_epi.css">
</head>
<body>

<main class="page">
    <div class="container">
        <div class="header">
            <div>
                <h1>Consulta de Registros EPI</h1>
                <p>Últimos 20 registros cadastrados. Você também pode buscar pelo número do EPI.</p>
            </div>

            <form class="search-form" method="GET" action="">
                <input
                    type="text"
                    name="busca"
                    placeholder="Buscar número do EPI..."
                    value="<?php echo htmlspecialchars($busca); ?>"
                >
                <button type="submit">Buscar</button>

                <?php if ($busca !== ''): ?>
                    <a class="clear-btn" href="listar_epi.php">Limpar</a>
                <?php endif; ?>
            </form>
        </div>

        <div class="table-wrapper">
            <table class="epi-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Nome</th>
                        <th>Jaqueta</th>
                        <th>Calça</th>
                        <th>Bota</th>
                        <th>Capacete</th>
                        <th>Condição de uso</th>
                        <th>Assinatura</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($registros)): ?>
                        <?php foreach ($registros as $registro): ?>
                            <tr>
                                <td>
                                    <?php
                                        echo !empty($registro['criado_em'])
                                            ? date('d/m/Y', strtotime($registro['criado_em']))
                                            : '-';
                                    ?>
                                </td>

                                <td><?php echo htmlspecialchars($registro['nome']); ?></td>
                                <td><?php echo htmlspecialchars($registro['jaqueta']); ?></td>
                                <td><?php echo htmlspecialchars($registro['calca']); ?></td>
                                <td><?php echo htmlspecialchars($registro['bota']); ?></td>
                                <td><?php echo htmlspecialchars($registro['capacete']); ?></td>
                                <td>
                                    <?php
                                        $condicao = trim($registro['condicao_uso'] ?? '');

                                        if ($condicao === '') {
                                            echo '<span class="status-neutral">Não informado</span>';
                                        } elseif (
                                            strtolower($condicao) === 'sim' ||
                                            strtolower($condicao) === 'ok' ||
                                            strtolower($condicao) === 'bom'
                                        ) {
                                            echo '<span class="status-ok">' . htmlspecialchars($registro['condicao_uso']) . '</span>';
                                        } else {
                                            echo '<span class="status-warning">' . htmlspecialchars($registro['condicao_uso']) . '</span>';
                                        }
                                    ?>
                                </td>

                                <td>
                                    <?php if (!empty($registro['assinatura_path'])): ?>
                                        <a
                                            class="signature-btn"
                                            href="<?php echo htmlspecialchars($registro['assinatura_path']); ?>"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Ver assinatura
                                        </a>
                                    <?php else: ?>
                                        <span class="no-signature">Sem assinatura</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="8" class="empty-message">
                                <?php if ($busca !== ''): ?>
                                    Nenhum registro encontrado para a busca <strong>"<?php echo htmlspecialchars($busca); ?>"</strong>.
                                <?php else: ?>
                                    Nenhum registro encontrado.
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</main>

</body>
</html>