export class View {
    private _el: HTMLElement;

    constructor(el: HTMLElement) {
        this._el = el;
    }

    template(model: any[]): string {
        throw new Error('O método template deve ser implementado');
    }

    update(model: any[]) {
        this._el.innerHTML = this.template(model);
    }
}