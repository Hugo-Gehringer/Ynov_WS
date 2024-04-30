const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const port = 3000;
app.use(express.static('public'));
app.use(express.json())

app.listen(port, () => {
  console.log(`API démarrée sur http://localhost:${port}`);
});

const { createMask, readMask, readAllMasks, updateMask, removeMask, createEntry, readEntry, readAllEntries, updateEntry, removeEntry } = require('./ws_crud_mysql');
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'A simple Express API',
        },
    },
    apis: ['./app.js'], // change this to the actual paths of your files
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========= MASK ==========

/**
 * @swagger
 * /masks:
 *   post:
 *     summary: Create a new mask
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               name:
 *                 type: string
 *               mask_json:
 *                 type: object
 *     responses:
 *       201:
 *         description: The ID of the created mask
 *       400:
 *         description: Missing information in the request
 *       500:
 *         description: Internal server error
 */
app.post('/masks', async (req, res) => {
    const { description, name, mask_json } = req.body;

    if (!description || !name || !mask_json) {
        return res.status(400).json({ error: 'Il manque des informations dans la requête' });
    }

    try {
        const createdId = await createMask(description, name, mask_json);
        res.status(201).json({ id: createdId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});
/**
 * @swagger
 * /masks/{id}:
 *   put:
 *     summary: Update a mask
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               name:
 *                 type: string
 *               mask_json:
 *                 type: object
 *     responses:
 *       200:
 *         description: The updated mask
 *       404:
 *         description: Mask not found
 *       500:
 *         description: Internal server error
 */
app.put('/masks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description, name, mask_json } = req.body;
        const updated = await updateMask(id, description, name, mask_json);
        if (updated) {
            res.status(200).send({ id, description, name, mask_json });
        } else {
            res.status(404).send({ message: "Mask not found" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /masks:
 *   get:
 *     summary: Retrieve a list of masks
 *     responses:
 *       200:
 *         description: A list of masks
 *       500:
 *         description: Internal server error
 */
app.get('/masks', async (req, res) => {
    try {
        const masks = await readAllMasks();
        res.status(200).send(masks);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /masks/{id}:
 *   get:
 *     summary: Retrieve a mask by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested mask
 *       404:
 *         description: Mask not found
 *       500:
 *         description: Internal server error
 */
app.get('/masks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const mask = await readMask(id);
        if (mask) {
            res.status(200).send(mask);
        } else {
            res.status(404).send({ message: "Mask not found" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /masks/{id}:
 *   delete:
 *     summary: Delete a mask by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Mask successfully deleted
 *       500:
 *         description: Internal server error
 */
app.delete('/masks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await removeMask(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// ========= ENTRY ==========
/**
 * @swagger
 * /entries:
 *   get:
 *     summary: Retrieve a list of entries
 *     responses:
 *       200:
 *         description: A list of entries
 *       500:
 *         description: Internal server error
 */
app.get('/entries', async (req, res) => {
    try {
        const entries = await readAllEntries();
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @swagger
 * /entries/{id}:
 *   get:
 *     summary: Retrieve an entry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested entry
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Internal server error
 */
app.get('/entries/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const entry = await readEntry(id);
        if (entry) {
            res.status(200).json(entry);
        } else {
            res.status(404).send('Entry not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @swagger
 * /entries:
 *   post:
 *     summary: Create a new entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_mask:
 *                 type: integer
 *               entry_json:
 *                 type: object
 *     responses:
 *       201:
 *         description: The ID of the created entry
 *       400:
 *         description: Missing fields
 *       500:
 *         description: Internal server error
 */
app.post('/entries', async (req, res) => {
    try {
        const { id_mask, entry_json } = req.body;
        if (!id_mask || !entry_json) {
            res.status(400).send('Missing fields');
            return;
        }
        const id = await createEntry(id_mask, entry_json);
        res.status(201).send(`Entry created with ID: ${id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @swagger
 * /entries/{id}:
 *   put:
 *     summary: Update an entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_mask:
 *                 type: integer
 *               entry_json:
 *                 type: object
 *     responses:
 *       200:
 *         description: The updated entry
 *       400:
 *         description: Missing fields
 *       500:
 *         description: Internal server error
 */
app.put('/entries/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { id_mask, entry_json } = req.body;
        if (!id_mask || !entry_json) {
            res.status(400).send('Missing fields');
            return;
        }
        await updateEntry(id, id_mask, entry_json);
        res.status(200).send(`Entry updated with ID: ${id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @swagger
 * /entries/{id}:
 *   delete:
 *     summary: Delete an entry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entry successfully deleted
 *       500:
 *         description: Internal server error
 */
app.delete('/entries/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await removeEntry(id);
        res.status(200).send(`Entry deleted with ID: ${id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route to render index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});