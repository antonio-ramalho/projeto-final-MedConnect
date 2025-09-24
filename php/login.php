<?php
    $listaUsuario = [];

    $listaUsuario[] = ['login' => 'Antonio', 'senha' => '1234'];
    $listaUsuario[] = ['login' => 'teste2', 'senha' => 'teste2'];
    $listaUsuario[] = ['login' => 'teste3', 'senha' => 'teste3'];
    $listaUsuario[] = ['login' => 'teste4', 'senha' => 'teste4'];
    $listaUsuario[] = ['login' => 'test5', 'senha' => 'teste5'];

    $login = $_POST['login'];
    $senha = $_POST['senha'];

    $i = 0;

    while (true) {
        $verify = $listaUsuario[$i];

        if ($verify['login'] == $login && $verify['senha'] == $senha) {
            $retorno['msg'] = "Usuário autenticado!";
            $retorno['value'] = true;
            $retorno['user'] = $verify['login'];
            break;
        } else {
            $retorno['msg'] = "Usuário não autentificado!";
            $retorno['value'] = false;
        };

        $i++;

        if ($i == count($listaUsuario)) {
            break;
        };
    };

    header("Content-type: application/json, charset=UTF-8");
    echo json_encode($retorno);
?>