import { HttpService } from "../services/HttpService.js";
import { ScholarshipsView } from "../view/ScholarshipsView.js";
import { SelectView } from "../view/SelectView.js";
import { FavouritesScholarshipsView } from "../view/FavouritesScholarshipsView.js";

export class FavouritesScholarshipsController {
    constructor() {
        this._favouriteStorageKey = 'favourite-scholarships';
        this._scholarshipsSelected = [];
        this._favouritesScholarships = [];
        if (localStorage.length > 0) {
            for (let index = 0; index < JSON.parse(localStorage.getItem(this._favouriteStorageKey)).length; index++) {
                this._favouritesScholarships.push(JSON.parse(localStorage.getItem(this._favouriteStorageKey))[index]);
            }
        }
        this._addScholarshipsButton = document.querySelector('#buttonAddScholarships');
        this._citySelect = document.querySelector('#selectCity');
        this._courseSelect = document.querySelector('#selectCourse');
        this._presentialLearningCheckbox = document.querySelector('#presentialLearning');
        this._distanceLearningCheckbox = document.querySelector('#disntanceLearning');
        this._price = document.querySelector('#price');
        this._priceSpan = document.querySelector('#priceSpan');
        this._modal = document.querySelector('#modal');
        this._closeModalButton = document.querySelector('#btnClose');
        this._cancelButton = document.querySelector('#btnCancel');
        this._semesterFilterDivs = Array.from(document.querySelectorAll('.filter-semester'));
        this._viewScholarships = new ScholarshipsView(document.getElementById('scholarships-list'));
        this._viewCitySelect = new SelectView(this._citySelect);
        this._viewCourseSelect = new SelectView(this._courseSelect);
        this._viewFavouritesScholarships = new FavouritesScholarshipsView(document.querySelector('#favourites-scholarships'));
        this._http = new HttpService();
        this._updateFavouritesScholarships(this._favouritesScholarships);
        this._init();
    }
    _openModal(e) {
        document.querySelector('body').style.overflowY = 'hidden';
        this._modal.style.display = 'block';
        this._applyFilters();
    }
    _closeModal() {
        document.querySelector('body').style.overflowY = 'auto';
        this._modal.style.display = 'none';
    }
    _outsideClick(e) {
        if (e.target == this._modal)
            this._closeModal();
    }
    _sortScholarships(data) {
        data.sort((a, b) => {
            let textA = a.university.name;
            let textB = b.university.name;
            return textA.localeCompare(textB);
        });
        return data;
    }
    _filterCity(scholarships) {
        scholarships = scholarships.filter((scholarship) => (scholarship.campus.city == this._citySelect.value || this._citySelect.value == ''));
        return scholarships;
    }
    _filterCourse(scholarships) {
        scholarships = scholarships.filter((scholarship) => (scholarship.course.name == this._courseSelect.value || this._courseSelect.value == ''));
        return scholarships;
    }
    _filterLearningType(scholarships) {
        let learningTypeSelected = '';
        if (this._distanceLearningCheckbox.checked && !this._presentialLearningCheckbox.checked) {
            learningTypeSelected = 'EaD';
        }
        else if (!this._distanceLearningCheckbox.checked && this._presentialLearningCheckbox.checked) {
            learningTypeSelected = 'Presencial';
        }
        scholarships = scholarships.filter((scholarship) => (scholarship.course.kind == learningTypeSelected || learningTypeSelected == ''));
        return scholarships;
    }
    _filterPrice(scholarships) {
        const price = parseFloat(this._price.value);
        scholarships = scholarships.filter((scholarship) => (scholarship.price_with_discount <= price));
        return scholarships;
    }
    _showScholarships(scholarships) {
        let filtered = scholarships.filter((val, i, el) => {
            return this._findWithAttr(this._favouritesScholarships, 'id', val.id) < 0 || this._favouritesScholarships.length == 0;
        });
        this._viewScholarships.update(filtered);
    }
    _findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
    _applyFilters() {
        let filteredSholarships = this._scholarshipsList;
        filteredSholarships = this._filterCity(filteredSholarships);
        filteredSholarships = this._filterCourse(filteredSholarships);
        filteredSholarships = this._filterLearningType(filteredSholarships);
        filteredSholarships = this._filterPrice(filteredSholarships);
        this._showScholarships(filteredSholarships);
        this._addCheckboxScholarshipsEvents();
    }
    async _getScholarships() {
        return this._http.get('https://testapi.io/api/redealumni/scholarships')
            .then(data => {
            this._scholarshipsListOriginal = data;
            let count = 0;
            this._scholarshipsListOriginal.forEach(element => {
                element.id = count;
                count++;
            });
            data = this._sortScholarships(data);
            this._showScholarships(data);
            return data;
        });
    }
    _changePrice(e) {
        this._priceSpan.innerHTML = this._price.value;
        this._applyFilters();
    }
    _loadCities() {
        let cityList = [];
        this._scholarshipsList.forEach(el => {
            if (cityList.indexOf(el.campus.city) === -1)
                cityList.push(el.campus.city);
        });
        cityList.sort();
        this._viewCitySelect.update(cityList);
    }
    _loadCourses() {
        let courseList = [];
        this._scholarshipsList.forEach(el => {
            if (courseList.indexOf(el.course.name) === -1)
                courseList.push(el.course.name);
        });
        courseList.sort();
        this._viewCourseSelect.update(courseList);
    }
    _clickCheckboxScholarship(e, checkboxScholarshipsList) {
        this._scholarshipsSelected = [];
        checkboxScholarshipsList.forEach(element => {
            if (element.checked) {
                this._scholarshipsSelected.push(element.id.split('-')[2]);
            }
        });
        if (this._scholarshipsSelected.length) {
            this._addScholarshipsButton.classList.remove('button--state-disabled');
            this._addScholarshipsButton.removeAttribute('disabled');
        }
        else {
            this._addScholarshipsButton.classList.add('button--state-disabled');
            this._addScholarshipsButton.setAttribute('disabled', 'disabled');
        }
    }
    _addScholarshipsFavourites() {
        this._scholarshipsSelected.forEach(element => {
            if (this._favouritesScholarships.indexOf(this._getScholarshipById(element)) < 0) {
                this._favouritesScholarships.push(this._getScholarshipById(element));
            }
        });
        this._updateLocalStorage();
        this._updateFavouritesScholarships(this._favouritesScholarships);
        this._closeModal();
    }
    _getScholarshipById(id) {
        let scholarship;
        this._scholarshipsList.forEach(element => {
            if (element.id == parseInt(id)) {
                scholarship = element;
            }
        });
        return scholarship;
    }
    _addCheckboxScholarshipsEvents() {
        let checkboxScholarshipsList = Array.from(document.querySelectorAll('.scholarship-checkbox'));
        checkboxScholarshipsList.forEach(element => {
            element.addEventListener('click', (e) => this._clickCheckboxScholarship(e, checkboxScholarshipsList));
        });
    }
    _updateFavouritesScholarships(favouritesScholarships) {
        this._viewFavouritesScholarships.update(favouritesScholarships);
        document.querySelector('#addScholarship').addEventListener('click', (e) => this._openModal(e));
        Array.from(document.querySelectorAll('.btn-delete-favourite')).forEach(el => {
            el.addEventListener('click', (e) => this._removeFavouriteScholarship(e));
        });
    }
    _removeFavouriteScholarship(e) {
        let element = e.target;
        this._favouritesScholarships = this._favouritesScholarships.filter(item => item.id != parseInt(element.id.split('-')[1]));
        this._updateLocalStorage();
        this._updateFavouritesScholarships(this._favouritesScholarships);
    }
    _semesterFilter(e) {
        let element = e.target;
        document.querySelector('.select-card--status-selected').classList.remove('select-card--status-selected');
        element.classList.add('select-card--status-selected');
        let action = element.id.split('-')[1];
        let favourites = this._favouritesScholarships.filter(el => {
            switch (action) {
                case 'all':
                    return true;
                    break;
                case '2019_2':
                    return el.enrollment_semester == '2019.2';
                    break;
                case '2020_1':
                    return el.enrollment_semester == '2020.1';
                    break;
            }
        });
        this._updateFavouritesScholarships(favourites);
    }
    _addEvents() {
        this._closeModalButton.addEventListener('click', (e) => this._closeModal());
        this._citySelect.addEventListener('change', (e) => this._applyFilters());
        this._courseSelect.addEventListener('change', (e) => this._applyFilters());
        this._distanceLearningCheckbox.addEventListener('click', (e) => this._applyFilters());
        this._presentialLearningCheckbox.addEventListener('click', (e) => this._applyFilters());
        this._cancelButton.addEventListener('click', (e) => this._closeModal());
        this._price.addEventListener('input', (e) => this._changePrice(e));
        this._addScholarshipsButton.addEventListener('click', (e) => this._addScholarshipsFavourites());
        this._addCheckboxScholarshipsEvents();
        this._semesterFilterDivs.forEach(el => {
            el.addEventListener('click', (e) => this._semesterFilter(e));
        });
    }
    _updateLocalStorage() {
        localStorage.setItem(this._favouriteStorageKey, JSON.stringify(this._favouritesScholarships));
    }
    async _init() {
        this._scholarshipsList = await this._getScholarships();
        this._loadCities();
        this._loadCourses();
        window.addEventListener('click', (e) => this._outsideClick(e));
        this._addEvents();
    }
}