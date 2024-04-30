<?php

$baseUrl = 'http://localhost:3000/masks';

function checkApiStatus($url) {
    // Vérification du statut de l'API
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($httpcode == 200) {
        echo "200 OK.\n\n";
    } else {
        echo "Problème d'accès à l'API, status {$httpcode}.";
    }

    curl_close($ch);
}

function getData($url) {
    // Requête GET
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    echo 'GET Response: ' . $response . "\n";
    curl_close($ch);
}

function postData($url, $data) {
    // Requête POST
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    echo 'POST Response: ' . $response . "\n";
    curl_close($ch);
    // Retourner l'ID de l'élément créé
    return json_decode($response, true)['id'];
}

function putData($url, $data) {
    // Requête PUT
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    echo 'PUT Response: ' . $httpcode . "\n";
    curl_close($ch);
}

function deleteData($url) {
    // Requête DELETE
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    echo 'DELETE Response: ' . $httpcode . "\n";
    curl_close($ch);
}

checkApiStatus($baseUrl);

$dataPost = array(
    "description" => "document de test pour le post",
    "name" => "TEST_POST",
    "mask_json" => new stdClass()
);

$dataPut = array(
    "description" => "document de test pour le put",
    "name" => "TEST_PUT",
    "mask_json" => new stdClass()
);

$itemId = postData($baseUrl, $dataPost);

if ($itemId) {
    $url = "{$baseUrl}/{$itemId}";
    getData($url);
    putData($url, $dataPut);
    deleteData($url);
    getData($baseUrl);
} else {
    echo 'Erreur lors de la création de l\'élément.';
}

?>