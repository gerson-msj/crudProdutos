import ViewModel from "./viewModel.js";
import Departamento from "../../models/departamento.js";
import Produto from "../../models/produto.js";

const viewModel = new ViewModel();

/** @type {Produto[]} */
let produtos = [];

/** @type {number} */
let lastIdProduto;

function main() {

    const departamentos = obterDepartamentos();
    viewModel.definirDepartamentos(departamentos);
    viewModel.novoProduto();
    viewModel.onsalvar = salvar;    // Create.
    viewModel.onfiltrar = filtrar;  // Read.
    viewModel.oneditar = editar;    // Update.
    viewModel.onexcluir = excluir;  // Delete.

    lastIdProduto = 0;

    viewModel.apresentarProdutos(produtos);

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
function salvar(produto) {
    if (produto.id == 0) {
        produto.id = ++lastIdProduto;
        produtos.push(produto);
        viewModel.incluirProduto(produto);
    }
    else {
        const produtoAntigo = produtos.find(p => p.id == produto.id);
        if (produtoAntigo) {
            produtoAntigo.nome = produto.nome;
            produtoAntigo.idDepartamento = produto.idDepartamento;
            produtoAntigo.marca = produto.marca;
            produtoAntigo.peso = produto.peso;
            produtoAntigo.preco = produto.preco;
        }

        filtrar(viewModel.filtroNome, viewModel.filtroDepartamento);
    }

    viewModel.novoProduto();
}

/**
 * @param {number} id 
 */
function excluir(id) {
    if (confirm("Deseja remover o produto?")) {
        produtos = produtos.filter(p => p.id != id);
        filtrar(viewModel.filtroNome, viewModel.filtroDepartamento);
        viewModel.novoProduto();
    }
}

/**
 * @param {number} id 
 */
function editar(id) {
    const produto = produtos.find(p => p.id == id);
    if (produto)
        viewModel.editarProduto(produto);
}

/**
 * @param {string} filtroNome 
 * @param {number} filtroDepartamento 
 */
function filtrar(filtroNome, filtroDepartamento) {

    let produtosFiltrados = produtos.slice();
    if (filtroNome != "")
        produtosFiltrados = produtosFiltrados.filter(p => p.nome.toLowerCase().includes(filtroNome.toLowerCase()));

    if (filtroDepartamento > 0)
        produtosFiltrados = produtosFiltrados.filter(p => p.idDepartamento == filtroDepartamento);

    viewModel.apresentarProdutos(produtosFiltrados);
}

main();