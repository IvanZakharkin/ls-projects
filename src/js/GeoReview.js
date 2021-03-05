import Map from './Map'

export default class GeoReview {
    constructor() {
        this.localStorageKey = 'geoReviews';
        this.formTemplate = document.querySelector('#templateBalloon').innerHTML;
        this.map = new Map('ymap', this.onClick.bind(this));
        this.map.init().then(this.onInit.bind(this));
    }

    onInit() {
        const reviews = this.getDataFromLocalStorage();

        for (const coords in reviews) {
            reviews[coords].forEach(() => {
                this.map.createPlacemark(JSON.parse(coords));
            })
        }

        document.body.addEventListener('click', this.onDocumentClick.bind(this));
    }

    createForm(coords, reviews) {
        const root = document.createElement('div');
        root.innerHTML = this.formTemplate;
        const form = root.querySelector('[data-role="form-review"]');
        const reviewsList = root.querySelector('[data-role="reviews-list"]');
        form.dataset.coords = JSON.stringify(coords);

        for (const key in reviews) {
            const review = this.reviewHtml(reviews[key]);
            reviewsList.append(review);
        }

        return root;
    }

    reviewHtml(reviewData) {
        const reviewDate = new Date(reviewData.date);
        const review = document.createElement('li');
        review.classList.add('reviews-list__item');
        const reviewHead = document.createElement('div');
        reviewHead.classList.add('reviews-list__item-head');
        const name = document.createElement('span');
        name.classList.add('reviews-list__item-name');
        const place = document.createElement('span');
        place.classList.add('reviews-list__item-place');
        const date = document.createElement('span');
        date.classList.add('reviews-list__item-date');
        const text = document.createElement('div');
        text.classList.add('reviews-list__item-text');
        name.textContent = reviewData.name;
        place.textContent = reviewData.place;
        date.textContent = `${reviewDate.getDate()}.${reviewDate.getMonth() + 1}.${reviewDate.getFullYear()}`;
        text.textContent = reviewData.text;

        reviewHead.append(name, place, date);
        review.append(reviewHead, text);

        return review;
    }

    getDataReview(form) {
        const fileds = Array.from(form.querySelectorAll('input, textarea'));
        const initObj = {
            date: new Date().getTime()
        };

        return fileds.reduce((data, field) => {
            data[field.name] = field.value;

            return data;
        }, initObj)

    }

    getReviewsByCoords(coords) {
        const reviews = this.getDataFromLocalStorage();

        return reviews[coords];
    }

    getDataFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem(this.localStorageKey));

        if (!data) {
            return {};
        }

        return data;
    }

    addDataToLocaleStorage(coords, review) {
        const data = this.getDataFromLocalStorage();

        if (!data[coords]) {
            data[coords] = [];
        }
        data[coords].push(review);
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    }

    onClick(coords) {
        const reviews = this.getReviewsByCoords(JSON.stringify(coords));
        const form = this.createForm(coords, reviews);
        
        this.map.openBalloon(coords, form.innerHTML);
    }

    onDocumentClick(e) {
        if (e.target.dataset.role === 'add-review') {
            const form = document.querySelector('[data-role="form-review"]');
            const coords = form.dataset.coords;
            const review = this.getDataReview(form);

            this.addDataToLocaleStorage(coords, review);
            this.map.createPlacemark(JSON.parse(coords));
            this.map.closeBalloon();
        }
    }
}