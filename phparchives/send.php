<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $nome = $_POST["nome"];
    $email = $_POST["email"];
    $mensagem = $_POST["mensagem"];

    $destino = "wagner.maiconhenrique@gmail.com";

    $assunto = "Novo contato do site";

    $corpo = "
    Nome: $nome\n
    Email: $email\n
    Mensagem:\n$mensagem
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