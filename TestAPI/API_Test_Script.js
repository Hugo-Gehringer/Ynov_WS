const axios = require('axios');

const baseUrl = 'http://localhost:3000/masks';

async function checkApiStatus(url) {
    try {
        const response = await axios.get(url);
        console.log("200 OK.\n");
    } catch (error) {
        console.log(`Problème d'accès à l'API, status ${error.response.status}.`);
    }
}

async function getData(url) {
    try {
        const response = await axios.get(url);
        console.log('GET Response:', response.data);
    } catch (error) {
        console.log('GET Error:', error.message);
    }
}

async function postData(url, data) {
    try {
        const response = await axios.post(url, data);
        console.log('POST Response:', response.data);
        return response.data.id;
    } catch (error) {
        console.log('POST Error:', error.message);
    }
}

async function putData(url, data) {
    try {
        const response = await axios.put(url, data);
        console.log('PUT Response:', response.status);
    } catch (error) {
        console.log('PUT Error:', error.message);
    }
}

async function deleteData(url) {
    try {
        const response = await axios.delete(url);
        console.log('DELETE Response:', response.status);
    } catch (error) {
        console.log('DELETE Error:', error.message);
    }
}

async function main() {
    await checkApiStatus(baseUrl);

    const dataPost = {
        description: "document de test pour le post",
        name: "TEST_POST",
        mask_json: {}
    };

    const dataPut = {
        description: "document de test pour le put",
        name: "TEST_PUT",
        mask_json: {}
    };

    const itemId = await postData(baseUrl, dataPost);
    if (itemId) {
        const itemUrl = `${baseUrl}/${itemId}`;
        await getData(itemUrl);
        await putData(itemUrl, dataPut);
        await deleteData(itemUrl);
        await getData(baseUrl);
    } else {
        console.log('Erreur lors de la création de l\'élément.');
    }
}

main();