import Produto from "../models/produto.js";

export default class ProdutoRepository {

    /** @type {IDBDatabase} */
    #db;

    #objectStoreName = "Produto";

    /** @param {IDBDatabase} db */
    constructor(db) {
        this.#db = db;
    }

    /**
     * @returns {Promise<Produto[]>}
     */
    obter() {
        return new Promise(resolve => {
            const transaction = this.#db.transaction(this.#objectStoreName, "readonly");
            const objectStore = transaction.objectStore(this.#objectStoreName);
            const request = objectStore.getAll();
            request.onsuccess = (ev) => {
                /**@type {Produto[]} */ const data = ev.target.result;
                const produtos = data.map(d => new Produto(d.id, d.idDepartamento, d.nome, d.marca, d.peso, d.preco));
                resolve(produtos);
            };
        });
    }

    /**
     * @param {Produto} produto 
     * @returns {Promise<void>}
     */
    salvar(produto) {
        return new Promise((resolve, reject) => {
            const transaction = this.#db.transaction(this.#objectStoreName, "readwrite");
            const objectStore = transaction.objectStore(this.#objectStoreName);

            const data = produto.id == 0
                ? JSON.parse(JSON.stringify(produto, (key, value) => key === 'id' ? undefined : value))
                : JSON.parse(JSON.stringify(produto));

            const request = objectStore.put(data);
            request.onsuccess = (ev) => {
                /**@type {number} */ const id = ev.target.result;
                produto.id = id;
                resolve();
            };
            request.onerror = (ev) => {
                /** @type {DOMException} */ const ex = ev.target.error;
                const errMsg = ex.name === "ConstraintError" ? "Produto já cadastrado!" : ex.message;
                reject(errMsg);
            };
        });
    }

    /**
     * @param {number} id 
     * @returns {Promise<void>}
     */
    excluir(id) {
        return new Promise((resolve) => {
            const transaction = this.#db.transaction(this.#objectStoreName, "readwrite");
            const objectStore = transaction.objectStore(this.#objectStoreName);
            const request = objectStore.delete(id);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * @param {number} id 
     * @returns {Promise<Produto | null>}
     */
    obterPorId(id) {
        return new Promise(resolve => {
            const transaction = this.#db.transaction(this.#objectStoreName, "readonly");
            const objectStore = transaction.objectStore(this.#objectStoreName);
            const request = objectStore.get(id);
            request.onsuccess = (ev) => {
                /**@type {Produto} */ const data = ev.target.result;
                const produto = data.id > 0 ? new Produto(data.id, data.idDepartamento, data.nome, data.marca, data.peso, data.preco) : null;
                resolve(produto);
            };
        });
    }

    /**
     * @param {string} nome 
     * @param {number} idDepartamento 
     * @returns {Promise<Produto[]>}
     */
    localizar(nome, idDepartamento) {
        return new Promise(resolve => {
            const transaction = this.#db.transaction(this.#objectStoreName, "readonly");
            const objectStore = transaction.objectStore(this.#objectStoreName);
            const index = objectStore.index("departamento_idx");
            const request = idDepartamento === 0
                ? index.openCursor(IDBKeyRange.lowerBound(idDepartamento, true))
                : index.openCursor(IDBKeyRange.only(idDepartamento));

            /**@type {Produto[]} */ const produtos = [];
            request.onsuccess = (ev) => {
                /**@type {IDBCursorWithValue | null} */ const cursor = ev.target.result;
                if (cursor) {
                    /**@type {Produto} */ const data = cursor.value;
                    if (nome.trim === "" || data.nome.toLowerCase().includes(nome.toLowerCase()))
                        produtos.push(new Produto(data.id, data.idDepartamento, data.nome, data.marca, data.peso, data.preco));

                    cursor.continue();
                } else {
                    resolve(produtos);
                }
            };
        });
    }


}