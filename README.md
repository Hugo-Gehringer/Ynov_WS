# Web Services

## Membres du groupe
- Hugo MAYONOBE
- Gabriel BOIG
- Maxime PALLEJA
- Hugo GEHRINGER

## Déployé sur Render : https://ynov-ws-ryzb.onrender.com/api-docs/

## Description

Projet de connexion, d'initialisation et de CRUD a 3 différentes type de Base de données, MongoDB, PgSQL et MySQL.
Il a été déployé avec seulement une base de donnée PQSQL sur Render et avec Swagger pour la documentation des API.

# Installation

```bash
npm install
```

# Test des Web Services

## MongoDB

### Test connection MongoDB
```bash
node ws_connect_mongo.js
```

### Initialiser database MongoDB
```bash
node ws_dbinit_mongo.js
```

### Test CRUD MongoDB
```bash
node ws_crud_mongo.js
```

## PgSQL

### Test connection PgSQL
```bash
node ws_connect_pg.js
```

### Initialiser database PgSQL
```bash
node ws_dbinit_pg.js
```

### Test CRUD PgSQL
```bash
node ws_crud_pg.js
```

## MySQL

### Test connection MySQL
```bash
node ws_connect_mysql.js
```

### Initialiser database MySQL
```bash

node ws_dbinit_mysql.js
```

### Test CRUD MySQL
```bash
node ws_crud_mysql.js
```

## Lancer Script Test API

### JS
```bash
node API_Test_Script.js
```

### Python
```bash
python3 API_Test_Script.py
```

### PHP
```bash
php API_Test_Script.php
```
