<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $nome = $_POST["name"] ?? '';
    $email = $_POST["email"] ?? '';
    $titulo = $_POST["subject"] ?? '';
    $mensagem = $_POST["message"] ?? '';

    $destino = "wagner.maiconhenrique@gmail.com";

    $assunto = "Novo contato do site: " . $titulo;

    $corpo = "
            Nome: $nome
            Email: $email
            Assunto: $titulo

            Mensagem:
            $mensagem
            ";

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    if (mail($destino, $assunto, $corpo, $headers)) {
        echo "Mensagem enviada com sucesso!";
    } else {
        echo "Erro ao enviar mensagem.";
    }
}
?>