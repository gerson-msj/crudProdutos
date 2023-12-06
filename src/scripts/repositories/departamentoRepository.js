import Departamento from "../models/departamento.js";

export default class DepartamentoRepository {

    /** @type {IDBDatabase} */
    #db;

    #objectStoreName = "Departamento";

    #deptos = [
        "Bebidas",
        "Brinquedos e Festas",
        "Congelados, frios e açougue.",
        "Eletroeletrônicos",
        "Esportes e Automotivos",
        "Higiene Pessoal",
        "Hortifruti",
        "Laticínios",
        "Limpeza",
        "Mercearia",
        "Padaria",
        "Papelaria",
        "Pet shop e Jardinagem",
        "Utilidades Domésticas",
        "Vestuário"
    ];

    /** @param {IDBDatabase} db */
    constructor(db) {
        this.#db = db;
    }

    initDepartamentos() {
        return new Promise((resolve) => {
            const transaction = this.#db.transaction(this.#objectStoreName, "readwrite");
            const objectStore = transaction.objectStore(this.#objectStoreName);
            const countRequest = objectStore.count();

            countRequest.onsuccess = async (ev) => {
                if(ev.target.result === 0) {
                    for (const depto of this.#deptos) {
                        const id = await this.#cadastrarDepartamento(objectStore, depto);
                    }
                }

                resolve();
            };
        });
    }

    /**
     * @param {IDBDatabase} objectStore 
     * @param {string} depto 
     * @returns {Promise<number>}
     */
    #cadastrarDepartamento(objectStore, depto) {
        return new Promise(resolve => {
            const request = objectStore.add({nome: depto});
            request.onsuccess = (ev) => resolve(ev.target.result);
        });
    }

    /**
     * @returns {Promise<Departamento[]>}
     */
    obterDepartamentos() {
        return new Promise(resolve => {
            const transaction = this.#db.transaction(this.#objectStoreName, "readonly");
            const objectStore = transaction.objectStore(this.#objectStoreName);
            const request = objectStore.getAll();
            request.onsuccess = (ev) => {
                /** @type {Departamento[]} */ const data = ev.target.result;
                const deptos = data.map(d => new Departamento(d.id, d.nome));
                resolve(deptos);
            };
        });
    }
}