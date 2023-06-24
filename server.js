require('dotenv').config();
const express = require('express');
const app = express();
const bp = require('body-parser');
const port = process.env.PORT || 5500;

app.use(express.static(__dirname + "/public"));
app.use(bp.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/", async (req, res) => {
    console.log(req.body);
    let text = req.body.text;
    let source_lang = req.body.source_lang;
    let target_lang = req.body.target_lang;
    const option = {
        method: 'POST',
        body: new URLSearchParams({ 'text': text, 'target_lang': target_lang, 'source_lang': source_lang })
    };

    try {
        const { default: fetch } = await import('node-fetch');
        const response = await fetch(process.env.URL, option);
        const result = await response.text();
        console.log(result);
        const parsedResult = JSON.parse(result);

        if (parsedResult.status === 'success') {
            return res.json({ 'status': 'success', 'target_lang': parsedResult.target_lang, 'text': parsedResult.text });
        } else {
            return res.json({ status: 'error', text: 'Error Occurred' });
        }
    } catch (err) {
        console.error(err);
        res.send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
