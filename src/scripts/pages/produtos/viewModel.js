import Departamento from "../../models/departamento.js";
import Produto from "../../models/produto.js";

export default class ViewModel {

    /** @type {HTMLInputElement} */
    #nome = document.getElementById("nome");
    get nome() { return this.#nome.value; }
    set nome(value) { this.#nome.value = value; }

    /** @type {HTMLSelectElement} */
    #departamento = document.getElementById("departamento");
    get idDepartamento() { return parseInt(this.#departamento.value); }
    set idDepartamento(value) { this.#departamento.value = value.toString(); }

    /** @type {HTMLInputElement} */
    #marca = document.getElementById("marca");
    get marca() { return this.#marca.value; }
    set marca(value) { this.#marca.value = value; }

    /** @type {HTMLInputElement} */
    #peso = document.getElementById("peso");
    get peso() { return this.#peso.value; }
    set peso(value) { this.#peso.value = value; }

    /** @type {HTMLInputElement} */
    #preco = document.getElementById("preco");
    get preco() { return isNaN(this.#preco.value) ? undefined : parseFloat(this.#preco.value); }
    set preco(value) { this.#preco.value = isNaN(value) ? '' : value.toString(); }

    /** @type {HTMLDivElement} */
    #botoesNovo = document.getElementById("botoesNovo");

    /** @type {HTMLDivElement} */
    #botoesEdicao = document.getElementById("botoesEdicao");

    /** @type {HTMLButtonElement} */
    #cadastrar = document.getElementById("cadastrar");
    
    /** @type {HTMLButtonElement} */
    #limpar = document.getElementById("limpar");
    
    /** @type {HTMLButtonElement} */
    #salvar = document.getElementById("salvar");
    
    /** @type {HTMLButtonElement} */
    #cancelar = document.getElementById("cancelar");
    /** @function */
    oncancelar = null;

    /** @type {HTMLButtonElement} */
    #excluir = document.getElementById("excluir");
    
    /**
     * @param {number} id 
     */
    onexcluir = (id) => {};

    /** @type {HTMLInputElement} */
    #filtroNome = document.getElementById("filtroNome");
    get filtroNome() { return this.#filtroNome.value; }
    
    /** @type {HTMLSelectElement} */
    #filtroDepartamento = document.getElementById("filtroDepartamento");
    get filtroDepartamento() { return parseInt(this.#filtroDepartamento.value); }

    /**
     * @param {string} filtroNome 
     * @param {number} filtroDepartamento 
     */
    onfiltrar = (filtroNome, filtroDepartamento) => {};

    /**
     * @param {Produto} produto 
     */
    onsalvar = (produto) => {};

    /**@param {number} id */
    oneditar = (id) => {};

    /** @type {Departamento[]} */
    #departamentos = [];

    /** @type {Produto} */
    #produto = [];

    /** @type {HTMLTableElement} */
    #tabela = document.getElementById("tabela");

    constructor() {
        this.#cadastrar.onclick = () => {
            if (this.#podeSalvar()) {
                this.#writeToProduto();
                this.onsalvar(this.#produto);
            }
        };

        this.#limpar.onclick = () => this.novoProduto();
        
        this.#salvar.onclick = () => {
            if (this.#podeSalvar()) {
                this.#writeToProduto();
                this.onsalvar(this.#produto);
            }
        };

        this.#cancelar.onclick = () => this.novoProduto();
        this.#excluir.onclick = () => this.onexcluir(this.#produto.id);

        this.#filtroNome.onkeyup = () => this.onfiltrar(this.filtroNome, this.filtroDepartamento);
        this.#filtroDepartamento.onchange = () => this.onfiltrar(this.filtroNome, this.filtroDepartamento);

        [this.#nome, this.#marca, this.#peso, this.#preco].forEach(e => e.addEventListener("keyup", () => this.#ativarBotoes()));
        this.#departamento.addEventListener("change", () => this.#ativarBotoes());
    }

    #ativarBotoes() {
        const disabled = !this.#podeSalvar();
        this.#cadastrar.disabled = disabled;
        this.#salvar.disabled = disabled;
    }

    /**
     * @param {Departamento[]} departamentos 
     */
    definirDepartamentos(departamentos) {
        this.#departamentos = departamentos;
        const defaultOptionCadastro = document.createElement("option");
        defaultOptionCadastro.value = "0";
        defaultOptionCadastro.text = "-- Selecione --";
        this.#departamento.add(defaultOptionCadastro);

        const defaultOptionFiltro = document.createElement("option");
        defaultOptionFiltro.value = "0";
        defaultOptionFiltro.text = "-- Todos --";
        this.#filtroDepartamento.add(defaultOptionFiltro);

        departamentos.forEach(d => {
            this.#departamento.add(this.#departamentoToOption(d));
            this.#filtroDepartamento.add(this.#departamentoToOption(d));
        });
    }

    /**
     * @param {Departamento} departamento 
     * @returns {HTMLOptionElement}
     */
    #departamentoToOption(departamento) {
        const option = document.createElement("option");
        option.value = departamento.id.toString();
        option.text = departamento.nome;
        return option;
    }

    novoProduto() {
        this.#produto = new Produto();
        this.#readFromProduto();
        this.#botoesNovo.classList.remove("ocultar");
        this.#botoesEdicao.classList.add("ocultar");
        this.#ativarBotoes();
        this.#nome.focus();
    }

    /**
     * @param {Produto} produto 
     */
    editarProduto(produto) {
        this.#produto = produto;
        this.#readFromProduto();
        this.#botoesNovo.classList.add("ocultar");
        this.#botoesEdicao.classList.remove("ocultar");
        this.#ativarBotoes();
        this.#nome.focus();
    }

    #readFromProduto() {
        this.nome = this.#produto.nome;
        this.idDepartamento = this.#produto.idDepartamento;
        this.marca = this.#produto.marca;
        this.peso = this.#produto.peso;
        this.preco = this.#produto.preco;
    }

    #writeToProduto() {
        this.#produto.nome = this.nome;
        this.#produto.idDepartamento = this.idDepartamento;
        this.#produto.marca = this.marca;
        this.#produto.peso = this.peso;
        this.#produto.preco = this.preco;
    }

    #podeSalvar() {
        return this.nome.trim() != ''
            && this.idDepartamento > 0
            && this.marca.trim() != ''
            && this.peso.trim() != ''
            && this.preco > 0;
    }

    /**
     * @param {Produto} produto 
     */
    incluirProduto(produto) {
        this.#tabela.appendChild(this.#produtoToTr(produto));
    }

    /**
     * @param {Produto[]} produtos 
     */
    apresentarProdutos(produtos) {
        this.#limparTabela();
        produtos.forEach(p => this.#tabela.appendChild(this.#produtoToTr(p)));
    }

    #limparTabela() {
        const trs = this.#tabela.getElementsByTagName("tr");
        const ids = []
        for (let index = 0; index < trs.length; index++) {
            const tr = trs[index];
            if(tr.id.startsWith("tr_")) 
                ids.push(tr.id);
        }

        ids.forEach(id => document.getElementById(id)?.remove());
    }

    /**
     * @param {Produto} produto 
     * @returns {HTMLTableRowElement}
     */
    #produtoToTr(produto) {
        const tr = document.createElement("tr");
        tr.id = `tr_${produto.id.toString()}`;
        const departamento = this.#departamentos.find(d => d.id == produto.idDepartamento);
        tr.appendChild(this.#valueToTd(produto.id.toString()));
        tr.appendChild(this.#valueToTd(departamento.nome));
        tr.appendChild(this.#valueToTd(produto.nome));
        tr.appendChild(this.#valueToTd(produto.marca));
        tr.appendChild(this.#valueToTd(produto.peso));
        tr.appendChild(this.#valueToTd(produto.preco.toString()));
        tr.onclick = () => this.oneditar(produto.id);
        return tr;
    }
    
    /**
     * @param {string} value 
     */
    #valueToTd(value){
        const td = document.createElement("td");
        td.textContent = value;
        return td;
    }
    
}

