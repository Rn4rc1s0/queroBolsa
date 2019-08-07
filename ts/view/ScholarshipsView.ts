import {
    View
} from "./View.js";
import {
    ts
} from "../types.js";

export class ScholarshipsView extends View {
    constructor(el: HTMLElement) {
        super(el);
    }

    template(model: ts.Scholarships[]): string {
        let html: string = ``;
        let discountPrice: string;

        model.forEach(el => {
            discountPrice = el.price_with_discount.toLocaleString('pt-br');
            html += 
            `<div class="scholarship-item">
                <div class="row">
                    <div class="col col-sm-6 col-4">
                        <label class='checkbox-container'>
                        <input type="checkbox" class="scholarship-checkbox" id="scholarship-checkbox-${el.id}">
                        <span class="checkmark scholarship-checkmark"></span>
                        <img src="${decodeURI(el.university.logo_url)}" class='scholarship-img' alt="Logo campus">
                        </label>
                    </div>
                    <div class="col col-sm-6 col-8">
                        <div class="scholarship-info">
                            <div class="row">
                                <div class="col col-6" style='margin-bottom:10px'>
                                    <p> <span class="font-color--blue font-weight--bold"> ${el.course.name} </span></p><br>
                                    <p> ${el.course.level} </p>
                                </div>
                                <div class="col col-6 text-align--right-desk">
                                    <p>Bolsa de <span class="font-color--green font-weight--bold">${el.discount_percentage.toFixed(2)} %</span></p><br>
                                    <p><span class="font-color--green font-weight--bold">R$ ${discountPrice} / mês </span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });

        return html;
    }
}