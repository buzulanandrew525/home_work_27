function Carousel(sliderLine) {
    this.container = document.createElement('div');
    this.container.className = "container";
    document.body.appendChild(this.container);

    this.sliders = [];
    this.indicators = [];
    this.slideInterval = null;
    this.intervalTime = sliderLine.intervalTime;
    this.showIndicators = sliderLine.showIndicators;
    this.numberOfSlider = sliderLine.numberOfSlider;
    this.counter = 0;
    this.step = 0;
}

Carousel.prototype.init = function() {
    this.createElements();
    this.loadImages();
    this.setupEventListeners();
}

Carousel.prototype.createElements = function() {
    this.wrapperSlider = document.createElement('div');
    this.wrapperSlider.className = "wrapper-slider";
    this.container.appendChild(this.wrapperSlider);
    this.sliderLine = document.createElement('div');
    this.sliderLine.className = "slider";
    this.wrapperSlider.appendChild(this.sliderLine);

    this.indicatorsContainer = document.createElement('div');
    this.indicatorsContainer.className = "img-indicators";
    this.container.appendChild(this.indicatorsContainer);

    this.prevButton = document.createElement('button');
    this.prevButton.className = "prev";
    this.prevButton.innerHTML = "&lt; PREV";
    this.container.appendChild(this.prevButton);
    
    this.nextButton = document.createElement('button');
    this.nextButton.className = "next";
    this.nextButton.innerHTML = "NEXT &gt;";
    this.container.appendChild(this.nextButton);

    this.playButton = document.createElement('button');
    this.playButton.className = "play";
    this.playButton.innerHTML = "PLAY";
    this.container.appendChild(this.playButton);

    this.pauseButton = document.createElement('button');
    this.pauseButton.className = "pause";
    this.pauseButton.innerHTML = "PAUSE";
    this.container.appendChild(this.pauseButton);
};

Carousel.prototype.loadImages = function() {
    let countSliders = 0;
    for (let i = 0; i < this.numberOfSlider; i++) {
        let img = document.createElement('img');
        img.src = `img/${i + 1}.jpg`;
        img.alt = `img/${i + 1}.jpg`;
        img.className = "slider-item";
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        this.sliders.push(img);

        img.onload = () => {
            countSliders++;
            if (countSliders === this.numberOfSlider) {
                this.step = this.sliders[0].offsetWidth;
                this.updateSlider();
                if(this.showIndicators) {
                    this.createIndicators();
                }
            }
        }
        this.sliderLine.appendChild(img);
    }
}

Carousel.prototype.createIndicators = function() {
    for (let i = 0; i < this.numberOfSlider; i++) {
        let indicator = document.createElement('span');
        indicator.className = "indicator";
        indicator.addEventListener('click', () => this.goToSlide(i));
        this.indicatorsContainer.appendChild(indicator);
        this.indicators.push(indicator);
    }
}

Carousel.prototype.updateSlider = function() {
    this.sliderLine.style.transform = 'translateX(' + (-this.step * this.counter) + 'px)';
}

Carousel.prototype.updateIndicators = function() {
    this.indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === this.counter);
    });
}

Carousel.prototype.showNextSlide = function() {
    this.counter = (this.counter + 1) % this.numberOfSlider;
    this.updateSlider();
    this.updateIndicators();
}

Carousel.prototype.showPrevSlide = function() {
    this.counter = (this.counter - 1 + this.numberOfSlider) % this.numberOfSlider;
    this.updateSlider();
    this.updateIndicators();
}

Carousel.prototype.goToSlide = function(index) {
    this.counter = index;
    this.updateSlider();
    this.updateIndicators();
}

Carousel.prototype.playSlide = function() {
    if(!this.slideInterval) {
        this.slideInterval = setInterval(() => this.showNextSlide(), this.intervalTime);
    }
}

Carousel.prototype.pauseSlide = function() {
    clearInterval(this.slideInterval);
    this.slideInterval = null;
}  

Carousel.prototype.setupEventListeners = function() {
    this.prevButton.addEventListener('click', () => this.showPrevSlide());
    this.nextButton.addEventListener('click', () => this.showNextSlide());
    this.playButton.addEventListener('click', () => this.playSlide());
    this.pauseButton.addEventListener('click', () => this.pauseSlide());
}

function SwipeCarousel(sliderLine) {
    Carousel.call(this, sliderLine);
}

SwipeCarousel.prototype = Object.create(Carousel.prototype);
SwipeCarousel.prototype.constructor = SwipeCarousel;

SwipeCarousel.prototype.init = function() {
    Carousel.prototype.init.call(this);
    this.setupSwipeListeners();
}

SwipeCarousel.prototype.setupSwipeListeners = function() {
    this.container.addEventListener('touchstart', this._swipeStart.bind(this));
    this.container.addEventListener('mousedown', this._swipeStart.bind(this));
    this.container.addEventListener('touchend', this._swipeEnd.bind(this));
    this.container.addEventListener('mouseup', this._swipeEnd.bind(this));
}

SwipeCarousel.prototype._swipeStart = function(e) {
    this.startPosX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;
}

SwipeCarousel.prototype._swipeEnd = function(e) {
    this.endPosX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;

    if (this.endPosX - this.startPosX > 100) {
        this.showPrevSlide();
    }
    if (this.endPosX - this.startPosX < -100) {
        this.showNextSlide();
    }
}

const carousel = new SwipeCarousel({
    numberOfSlider: 3,
    intervalTime: 3000,
    showIndicators: true
});

carousel.init();
