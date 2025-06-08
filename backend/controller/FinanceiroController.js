const Financeiro = require('../model/Financeiro');

exports.registrarFinanceiro = async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body); // Adicione este log
    
    // Verifique se os campos obrigatórios estão presentes
    if (!req.body.nomeCliente || !req.body.valorTotal || !req.body.formaPagamento) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios faltando',
        required: ['nomeCliente', 'valorTotal', 'formaPagamento']
      });
    }

    const novoRegistro = new Financeiro({
      nomeCliente: req.body.nomeCliente,
      servicoPrestado: req.body.servicoPrestado || 'Serviço técnico',
      maoDeObra: req.body.maoDeObra || 0,
      pecas: req.body.pecas || 0,
      valorTotal: req.body.valorTotal,
      formaPagamento: req.body.formaPagamento,
      statusPagamento: req.body.statusPagamento || 'Pago',
      data: new Date()
    });

    const saved = await novoRegistro.save();
    console.log('Registro salvo:', saved); // Adicione este log
    
    res.status(201).json(saved);
  } catch (err) {
    console.error('Erro detalhado no controller:', err);
    res.status(500).json({ 
      error: 'Erro ao salvar os dados financeiros',
      details: err.message,
      stack: err.stack // Isso ajuda a identificar onde ocorreu o erro
    });
  }
};