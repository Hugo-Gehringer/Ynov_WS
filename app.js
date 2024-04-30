const express = require('express');
const app = express();
const port = 3000;

app.use(express.json())

app.listen(port, () => {
  console.log(`API démarrée sur http://localhost:${port}`);
});

const { createMask, readMask, readAllMasks, updateMask, removeMask, createEntry, readEntry, readAllEntries, updateEntry, removeEntry } = require('./ws_crud_mysql'); 

// ========= MASK ==========

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

app.get('/masks', async (req, res) => {
    try {
        const masks = await readAllMasks();
        res.status(200).send(masks);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

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

app.get('/entries', async (req, res) => {
    try {
        const entries = await readAllEntries();
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

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

app.delete('/entries/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await removeEntry(id);
        res.status(200).send(`Entry deleted with ID: ${id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
