export class View {
    constructor(el) {
        this._el = el;
    }
    template(model) {
        throw new Error('O método template deve ser implementado');
    }
    update(model) {
        this._el.innerHTML = this.template(model);
    }
}