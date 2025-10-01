// Função para pegar produtos no localStorage ou retornar array vazio
function getProdutos() {
  const produtos = localStorage.getItem('produtos');
  return produtos ? JSON.parse(produtos) : [];
}

// Salvar produtos no localStorage
function salvarProdutos(produtos) {
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Adicionar ou atualizar produto
function salvarProduto(produto) {
  let produtos = getProdutos();

  if (produto.id) {
    // Atualizar produto 
    produtos = produtos.map(p => (p.id === produto.id ? produto : p));
  } else {
    produto.id = Date.now().toString();
    produtos.push(produto);
  }

  salvarProdutos(produtos);
}

    // Excluir produto
    function excluirProduto(id) {
      let produtos = getProdutos();
      produtos = produtos.filter(p => p.id !== id);
      salvarProdutos(produtos);
    }

// Preencher formulário
function carregarProduto(id) {
  const produtos = getProdutos();
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  document.getElementById('produtoId').value = produto.id;
  document.getElementById('nome').value = produto.nome;
  document.getElementById('preco').value = produto.preco;
  document.getElementById('categoria').value = produto.categoria;
  document.getElementById('origem').value = produto.origem;
  document.getElementById('lote').value = produto.lote;
  document.getElementById('validade').value = produto.validade;
}

// Lista de produtos
function listarProdutos() {
  const produtos = getProdutos();
  const tbody = document.querySelector('#tabelaProdutos tbody');
  tbody.innerHTML = '';

  produtos.forEach(produto => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
      <td>${produto.categoria}</td>
      <td>${produto.origem}</td>
      <td>${produto.lote}</td>
      <td>${produto.validade ? produto.validade.split('-').reverse().join('/') : ''}</td>
      <td>
        <button class="editar text-blue-600 underline" data-id="${produto.id}">Editar</button>
        <button class="excluir text-red-600 underline ml-2" data-id="${produto.id}">Excluir</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Botões de editar e excluir
  document.querySelectorAll('.editar').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id;
      window.location.href = `cadastro-tailwind.html?edit=${id}`;
    });
  });

  document.querySelectorAll('.excluir').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id;
      if (confirm('Confirma exclusão deste produto?')) {
        excluirProduto(id);
        listarProdutos();
      }
    });
  });
}

// Formulário
if (document.getElementById('formProduto')) {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');

  if (editId) {
    carregarProduto(editId);
  }

  const form = document.getElementById('formProduto');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const produto = {
      id: document.getElementById('produtoId').value || null,
      nome: document.getElementById('nome').value.trim(),
      preco: parseFloat(document.getElementById('preco').value).toFixed(2),
      categoria: document.getElementById('categoria').value.trim(),
      origem: document.getElementById('origem').value.trim(),
      lote: document.getElementById('lote').value.trim(),
      validade: document.getElementById('validade').value,
    };

    salvarProduto(produto);
    alert('Produto salvo com sucesso!');
    window.location.href = 'lista-tailwind.html';
  });
}

// Carrega os produtos para a tabela
if (document.getElementById('tabelaProdutos')) {
  listarProdutos();
}