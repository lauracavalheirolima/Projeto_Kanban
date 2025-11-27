// Use este arquivo para criar as tabelas do seu banco.
// O banco deve ser criado manualmente, este script não cria o banco.
// Esse script depende da configuração do arquivo .env

require('dotenv').config();
const { executarQuery } = require('./dbConnect');

async function criarTabelas() {
  try {
    console.log('Criando tabelas...');

    // Este codigo é responsavel por criar uma nova tabela
    // Se for criar uma nova tabela duplique este código e coloque sua tabela
    await executarQuery(`
      CREATE TABLE IF NOT EXISTS tabelaExemplo(
        id_exemplo INT AUTO_INCREMENT PRIMARY KEY,
        campo1 VARCHAR(100),
        campo2 VARCHAR(100),
        campo3 VARCHAR(100)
      );
    `);


    await executarQuery(`
     CREATE TABLE IF NOT EXISTS USUARIO (
      id_usuario INT PRIMARY KEY AUTO_INCREMENT,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE
    );
    `);


    await executarQuery(`
     CREATE TABLE TAREFA (
        id_tarefa INT PRIMARY KEY AUTO_INCREMENT,
        titulo VARCHAR(150) NOT NULL,
        status VARCHAR(50) NOT NULL,
        prioridade VARCHAR(50),
        executor VARCHAR(100),
        id_usuario INT NOT NULL,

        CONSTRAINT fk_tarefa_usuario
            FOREIGN KEY (id_usuario)
            REFERENCES USUARIO(id_usuario)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        );
    `);

    // Tenha cuidado porque a ordem de criação é importante
    // Se a tabela A possui uma foreing key para a tabela B
    // entao a tabela B deve ser criada antes da tabela A

    console.log('Tabelas criadas/verificadas com sucesso!');
  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  } finally {
    process.exit();
  }
}

criarTabelas();