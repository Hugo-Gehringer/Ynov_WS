import requests

BASE_URL = 'http://localhost:3000/masks'

def check_api_status(url):
    """Check du statut de l'API"""
    response = requests.get(url)
    if response.status_code == 200:
        print('200 OK.')
    else:
        print(f"Problème d'accès à l'API, status {response.status_code}.")

def get_data(url):
    """requête GET"""
    response = requests.get(url)
    print('GET Response:', response.json())

def post_data(url, data):
    """requête POST"""
    response = requests.post(url, json=data)
    print('POST Response:', response.json())
    # Retourner l'ID de l'élément créé
    return response.json().get('id')

def put_data(url, data):
    """requête PUT"""
    response = requests.put(url, json=data)
    print('PUT Response:', response.status_code)

def delete_data(url):
    """requête DELETE"""
    response = requests.delete(url)
    print('DELETE Response:', response.status_code)

check_api_status(BASE_URL)

data_post = {
    "description": "document de test pour le post",
    "name": "TEST_POST",
    "mask_json": {}
}

data_put = {
    "description": "document de test pour le put",
    "name": "TEST_PUT",
    "mask_json": {}
}

item_id = post_data(BASE_URL, data_post)

if item_id:
    url = f"{BASE_URL}/{item_id}"
    get_data(url)
    put_data(url, data_put)
    delete_data(url)
    get_data(BASE_URL)
else:
    print("Erreur lors de la récupération de l'ID après POST.")
