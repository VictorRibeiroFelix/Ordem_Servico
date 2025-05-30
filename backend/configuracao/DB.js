const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://victorribeirofelix15:<db_password>@cluster0.ru264vx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
