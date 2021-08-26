const sqlite3 = require('sqlite3')
const { open } = require('sqlite') // importa só a funcionalidade open do sqlite


// open precisa estar dentro de uma estrutura de funçao para funcionar corretamente
module.exports = () => 
   open({

        filename: './database.sqlite',
        driver: sqlite3.Database
    });
