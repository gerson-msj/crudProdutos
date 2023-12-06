import ViewModel from "./viewModel.js";
import Produto from "../../models/produto.js";
import DbContext from "../../dataAccess/dbContext.js";
import DepartamentoRepository from "../../repositories/departamentoRepository.js";
import ProdutoRepository from "../../repositories/produtoRepository.js";

const viewModel = new ViewModel();
const dbContext = new DbContext();

/** @type {DepartamentoRepository} */ let departamentoRepository;
/** @type {ProdutoRepository} */ let produtoRepository;

async function main() {

    try {
        await dbContext.InitDB();
    } catch (error) {
        alert(error);
        return;
    }

    departamentoRepository = new DepartamentoRepository(dbContext.db);
    await departamentoRepository.initialize();
    const departamentos = await departamentoRepository.obter();
    viewModel.definirDepartamentos(departamentos);

    produtoRepository = new ProdutoRepository(dbContext.db);
    await atualizarLista();

    viewModel.novoProduto();
    viewModel.onsalvar = salvar;    // Create.
    viewModel.onfiltrar = filtrar;  // Read.
    viewModel.oneditar = editar;    // Update.
    viewModel.onexcluir = excluir;  // Delete.
}

/**
 * @param {Produto} produto 
 */
async function salvar(produto) {

    try {
        await produtoRepository.salvar(produto);
        await atualizarLista();
    } catch (error) {
        alert(error);
    }

}

/**
 * @param {number} id 
 */
async function excluir(id) {
    if (confirm("Deseja remover o produto?")) {
        await produtoRepository.excluir(id);
        viewModel.novoProduto();
        await atualizarLista();
    }
}

/**
 * @param {number} id 
 */
async function editar(id) {
    const produto = await produtoRepository.obterPorId(id);
    if (produto)
        viewModel.editarProduto(produto);
}

async function atualizarLista() {
    await filtrar(viewModel.filtroNome, viewModel.filtroDepartamento);
}

/**
 * @param {string} filtroNome 
 * @param {number} filtroDepartamento 
 */
async function filtrar(filtroNome, filtroDepartamento) {
    const produtos = await produtoRepository.localizar(filtroNome, filtroDepartamento);
    viewModel.apresentarProdutos(produtos);
}

main();