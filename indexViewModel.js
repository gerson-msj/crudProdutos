import Departamento from "./departamento.js";
import Produto from "./produto.js";

export default class IndexViewModel {

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
    /** @type {Function} @param {Produto} produto */
    oncadastrar = null;

    /** @type {HTMLButtonElement} */
    #limpar = document.getElementById("limpar");
    /** @type {Function} */
    onLimpar = null;

    /** @type {HTMLButtonElement} */
    #salvar = document.getElementById("salvar");
    /** @type {Function} */
    onsalvar = null;

    /** @type {HTMLButtonElement} */
    #cancelar = document.getElementById("cancelar");
    /** @type {Function} */
    oncancelar = null;

    /** @type {HTMLButtonElement} */
    #excluir = document.getElementById("excluir");
    /** @type {Function} */
    onexcluir = null;

    /** @type {HTMLInputElement} */
    #filtroNome = document.getElementById("filtroNome");

    /** @type {HTMLSelectElement} */
    #filtroDepartamento = document.getElementById("filtroDepartamento");

    /** @type {Function} */
    onfiltrar = null;

    /** @type {Departamento[]} */
    #departamentos = [];

    /** @type {Produto} */
    #produto = [];

    /** @type {HTMLTableElement} */
    #tabela = document.getElementById("tabela");

    constructor() {
        this.#cadastrar.onclick = () => {
            if (this.oncadastrar && this.#podeCadastrar()){
                this.#writeToProduto();
                this.oncadastrar(this.#produto);
            }
        };

        this.#limpar.onclick = () => {
            if (this.onlimpar)
                this.onlimpar();
            this.novoProduto();
            this.#nome.focus();
        };

        this.#salvar.onclick = () => {
            if (this.onsalvar)
                this.onsalvar();
        };

        this.#cancelar.onclick = () => {
            if (this.oncancelar)
                this.oncancelar();
        };

        this.#excluir.onclick = () => {
            if (this.onexcluir)
                this.onexcluir();
        };

        this.#filtroNome.onkeyup = () => {
            if (this.onfiltrar)
                this.onfiltrar();
        };

        this.#filtroDepartamento.onchange = () => {
            if (this.onfiltrar)
                this.onfiltrar();
        };
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

    #podeCadastrar() {
        console.log(this.nome.trim(), this.idDepartamento, this.marca.trim(), this.peso.trim(), this.preco);
        const valido = this.nome.trim() != ''
            && this.idDepartamento > 0
            && this.marca.trim() != ''
            && this.peso.trim() != ''
            && this.preco > 0;

        if(!valido)
            alert("Existem campos inválidos!");

        return valido;
    }

    /**
     * @param {Produto} produto 
     */
    incluirProduto(produto) {
        this.#tabela.appendChild(this.#produtoToTr(produto));
    }

    /** @type {number} */
    editar(id) {
        console.log(id);

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
    
        tr.onclick = () => editar(produto.id);
    
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

