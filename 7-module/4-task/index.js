import createElement from "../../assets/lib/create-element.js";

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.render();
    this.addPointerEvents();
  }

  render() {
    this.stepPercent = Math.round(100 / (this.steps - 1)); // шаг слайдера в %
    this.startPercent = this.stepPercent * this.value; // начальный положение указателя слайдера

    this.elem = createElement(`
    <div class="slider">
      <div class="slider__thumb" style="left: ${this.startPercent}%;">
        <span class="slider__value">${this.value}</span>
      </div>
      <div class="slider__progress" style="width: ${this.startPercent}%;"></div>
      <div class="slider__steps">
        ${`<span></span>`.repeat(this.steps)}
      </div>
    </div>
    `);

    this.slider = this.elem.querySelector(".slider");
    this.slideThumb = this.elem.querySelector(".slider__thumb");
    this.slideThumb.ondragstart = () => false;
    this.slideProgress = this.elem.querySelector(".slider__progress");
    this.slideValue = this.elem.querySelector(".slider__value");

    this.slideNodes = this.elem.querySelectorAll(".slider__steps span");
    this.slideNodes[this.value].classList.add("slider__step-active"); // добавляет класс активному шагу при рендере
    this.activeStep = this.slideNodes[this.value];

    this.elem.addEventListener("click", (event) => {
      this.handleSelectStep(event);
      this.addingCastonEvent();
    });
  }

  handleSelectStep = (event) => {
    let leftDistance = event.clientX - this.elem.getBoundingClientRect().left; //расстояние от начала элемента слайдера до места, на котором находился курсор в момент клика
    let leftRelative = leftDistance / this.elem.offsetWidth; // дробное значение указателя слайдера от 0 до 1

    this.currentValue = Math.round(leftRelative * (this.steps - 1)); // значение указателя слайдера округленное до целого от 0 до 4
    this.currentPercent = (this.currentValue / (this.steps - 1)) * 100; // % заполнения слайдера

    this.slideThumb.style.left = `${this.currentPercent}%`; // новое значение для указателя слайдера
    this.slideProgress.style.width = `${this.currentPercent}%`; // новое значение для заполнения слайдера
    this.slideValue.textContent = this.currentValue; // новое значение для отображения под указателем слайдера

    this.selectActiveStep(this.currentValue);
  };

  addPointerEvents() {
    this.slideThumb.onpointerdown = (event) => {
      event.preventDefault();

      document.addEventListener("pointermove", this.onSlideThumbMove);

      document.onpointerup = () => {
        document.removeEventListener("pointermove", this.onSlideThumbMove);
        this.elem.classList.remove("slider_dragging");
        this.slideThumb.onpointerup = null;
        this.addingCastonEvent();
      };
    };
  }

  onSlideThumbMove = (event) => {
    event.preventDefault();
    this.elem.classList.add("slider_dragging");

    let leftDistance = event.clientX - this.elem.getBoundingClientRect().left; //расстояние от начала элемента слайдера до места, на котором находится курсор при перемещении
    let leftRelative = leftDistance / this.elem.offsetWidth; // дробное значение указателя слайдера при перемещении

    // отсекает лишние значения при выходе мыши за рамки слайдера
    if (leftRelative < 0) {
      leftRelative = 0;
    } else if (leftRelative > 1) {
      leftRelative = 1;
    }

    let leftPercents = leftRelative * 100; // вычисление % для положения указателя и заполнения слайдера при перемещении

    this.slideThumb.style.left = `${leftPercents}%`;
    this.slideProgress.style.width = `${leftPercents}%`;

    this.currentValue = Math.round(leftRelative * (this.steps - 1)); // значение указателя слайдера округленное до целого от 0 до 4 при перемещении
    this.slideValue.textContent = this.currentValue; // значение для отображения значения шага при перемещении

    this.selectActiveStep(this.currentValue);
  };

  // добавление/удаление класса для активного шага слайдера
  selectActiveStep = (step) => {
    this.activeStep.classList.remove("slider__step-active");
    this.activeStep = this.slideNodes[step];
    this.activeStep.classList.add("slider__step-active");
  };

  addingCastonEvent = () => {
    let addingEvent = new CustomEvent("slider-change", {
      detail: this.currentValue,
      bubbles: true,
    });
    this.elem.dispatchEvent(addingEvent);
  };
}
