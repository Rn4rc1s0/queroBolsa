import {
    View
} from "./View.js";

export class SelectView extends View {
    constructor(el: HTMLElement) {
        super(el);
    }

    template(model: string[]): string {
        let html: string = `<option value=""> Todos </option>`;

        model.forEach(el => {
            html += `<option value="${el}">${el}</option>`;
        });

        return html;
    }
}