import IndexViewModel from "./indexViewModel.js";
import Departamento from "./departamento.js";
import Produto from "./produto.js";

const viewModel = new IndexViewModel();

/** @type {Produto[]} */
let produtos = [];

/** @type {Produto} */
let produto;

/** @type {number} */
let lastIdProduto;

function main() {
    const departamentos = obterDepartamentos();
    viewModel.definirDepartamentos(departamentos);
    viewModel.novoProduto();

    viewModel.oncadastrar = cadastrar;

    lastIdProduto = 0;

    // IndexViewModel.buttonCadastrar.onclick = () => cadastrar();
    // IndexViewModel.filtroNome.onkeyup = () => filtrar();
    // IndexViewModel.filtroDepartamento.onchange = () => filtrar();

    // produtos.push(new Produto(1, 1, "Produto 1", "Marca", "1 kg", 9.99));
    // produtos.push(new Produto(2, 2, "Produto 2", "Marca", "1 kg", 9.99));
    // const tabela = document.getElementById("tabelaProdutos");
    // tabela.appendChild(produtoToTr(produtos[0]));
    // tabela.appendChild(produtoToTr(produtos[1]));
}




function obterDepartamentos() {
    const departamentos = [];
    departamentos.push(new Departamento(1, "Bebidas"));
    departamentos.push(new Departamento(2, "Congelados"));
    departamentos.push(new Departamento(3, "Mercearia"));
    return departamentos;
}



/**
 * @param {Produto} produto 
 */
function cadastrar(produto) {

    produto.id = ++lastIdProduto;
    produtos.push(produto);
    viewModel.incluirProduto(produto);
    viewModel.novoProduto();

    // const tabela = document.getElementById("tabelaProdutos");
    // tabela.appendChild(produtoToTr(produto));

    // IndexViewModel.formCadastro.reset();
}

/**
 * @param {number} id 
 */
function excluir(id) {
    produtos = produtos.filter(p => p.id != id);
    
    const tr = document.getElementById(`tr_${id}`);
    if(tr)
        tr.remove();
}

/**
 * @param {number} id 
 */
function editar(id){
    const selecionado = produtos.find(p => p.id == id);

}

function filtrar() {
    
    let produtosFiltrados = produtos.slice();
    if(IndexViewModel.filtroNome.value != "") {
        produtosFiltrados = produtosFiltrados.filter(p => p.nome.includes(IndexViewModel.filtroNome.value));
    }

    if(IndexViewModel.filtroDepartamento.value != "0") {
        produtosFiltrados = produtosFiltrados.filter(p => p.idDepartamento == parseInt(IndexViewModel.filtroDepartamento.value));
    }

    produtos.forEach(p => {
        const tr = document.getElementById(`tr_${p.id}`);
        if(tr)
            tr.remove();
    });

    const tabela = document.getElementById("tabelaProdutos");
    produtosFiltrados.forEach(p => {
        tabela.appendChild(produtoToTr(p));
    });
}

main();