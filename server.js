// Arquivo responsável pela execução do projeto

const express = require('express');
const app = new express();
const port = 3000;

app.use(express.static(`${__dirname}`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/src/index.html`);
});

app.listen(port, ()=> {
    console.log('Acesse http://localhost:3000 para acessar a aplicação!');
    console.log('Para derrubar o servidor pressione CTRL+C');
});