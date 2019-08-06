import { View } from "./View.js";
export class SelectView extends View {
    constructor(el) {
        super(el);
    }
    template(model) {
        let html = `<option value=""> Todos </option>`;
        model.forEach(el => {
            html += `<option value="${el}">${el}</option>`;
        });
        return html;
    }
}