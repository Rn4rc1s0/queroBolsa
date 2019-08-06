import { View } from "./View.js";

export class FavouritesScholarshipsView extends View {
    constructor(el) {
        super(el);
    }
    template(model) {
        let html = 
            `<div class="col col-3">
                <div class="card card-add" id='addScholarship'>
                    <i class="fas fa-plus-circle"></i>
                    <h2 class="card-title">Adicionar curso</h1>
                    <p> Clique para adicionar bolsas de cursos de seu interesse</p>
                </div>
            </div>`;

        let learningType = '';
        let fullPrice = '';
        let priceWithDiscount = '';
        let button = '';
        let stars = '';
        let countStars = 5;
        let scoreInt = 0;
        let scoreDecimal = 0.0;

        model.forEach(el => {
            stars = '';
            countStars = 5;
            scoreInt = Math.floor(el.university.score);
            scoreDecimal = el.university.score % 1;

            for (let index = 0; index < scoreInt; index++) {
                stars += `<i class="fas fa-star font-color--yellow"></i>`;
                countStars--;
            }
            if (scoreDecimal > 0) {
                stars += `<i class="fas fa-star-half-alt font-color--yellow"></i>`;
                countStars--;
            }
            while (countStars > 0) {
                stars += `<i class="far fa-star font-color--yellow"></i>`;
                countStars--;
            }

            learningType = (el.course.kind == 'Presencial') ? 'Presencial' : 'Ensino a distância';
            fullPrice = el.full_price.toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                style: 'currency',
                currency: 'BRL'
            });
            priceWithDiscount = el.price_with_discount.toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                style: 'currency',
                currency: 'BRL'
            });
            button = (el.enabled) ?
                `<button class="button button--style-yellow button--size-block"> Ver oferta </button>` :
                `<button class='button  button--size-block button--state-disabled' disabled>Indisponível</button>`;
            html += `
            <div class="col col-3">
                <div class="card">
                    <img src="${el.university.logo_url}" class='img-favorite-scholarship' alt="" srcset="">
                    <br>
                    <p class='font-weight--bold font-style--uppercase margin-bottom--small'> ${el.university.name} </p>
                    <p class='font-weight--bold font-color--blue font-style--uppercase margin-bottom--small'> ${el.course.name} </p>
                    <p> 
                        <span class='font-weight--bold'> ${el.university.score} </span>
                        ${stars}
                    </p>
                    <hr class='hr'>
                    <p class='font-weight--bold font-style--uppercase margin-bottom--small'>
                        ${learningType} &#149; ${el.course.shift}
                    </p>
                    <p>
                        Início das aulas em: ${el.start_date}
                    </p>
                    <hr class='hr'>
                    <p class='font-weight--bold margin-bottom--small'>
                        Mensalidade com o Quero Bolsa:
                    </p>
                    <p class='font-style--slash'>
                        ${fullPrice}
                    </p>
                    <p class='margin-bottom--large'>
                        <span class='font-weight--bold font-color--green '>${priceWithDiscount}</span> /mês
                    </p>
                    <div class="row">
                        <div class="col col-sm-5">
                            <button id='btnDeleteFavourite-${el.id}' class="button btn-delete-favourite button--style-outline-blue button--size-block"> Excluir </button>
                        </div>
                        <div class="col col-sm-7">
                            ${button}
                        </div>
                    </div>
                </div>
            </div>`;
        });
        return html;
    }
}
