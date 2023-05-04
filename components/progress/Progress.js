const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="./components/progress/progress.css" />
    <div class="progress">
    <div class="progress__title">Progress</div>
    <div class="progress__wrapper">
    <div class="progress__graph">
        <div class="progress__circle-wrap">
        <svg class="progress__ring" width="120" height="120">
            <circle
            class="progress__circle-background"
            stroke="#F0F3F6"
            stroke-width="8"
            cx="60"
            cy="60"
            r="44"
            fill="transparent"
            />
            <circle
            class="progress__circle"
            stroke="#255AF6"
            stroke-width="8"
            cx="60"
            cy="60"
            r="44"
            fill="transparent"
            />
        </svg>
        </div>
    </div>
    <div class="progress__controls">
        <div class="progress__control">
        <input type="number"  class="progress__input" value="100"/>
        <div class="progress__control-title">Value</div>
        </div>
        <div class="progress__control">
        <label class="progress__switch">
            <input name="animation" class="progress__checkbox" type="checkbox" />
            <span class="progress__slider progress__slider_round"></span>
        </label>
        <div class="progress__control-title">Animate</div>
        </div>
        <div class="progress__control">
        <label class="progress__switch">
            <input name="hide" class="progress__checkbox" type="checkbox" />
            <span class="progress__slider progress__slider_round"></span>
        </label>
        <div class="progress__control-title">Hide</div>
        </div>
    </div>
    </div>
    </div>
`;

class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  updateCircle = (val) => {
    const circle = this.shadowRoot.querySelector(".progress__circle");
    const curcumference = this.getCurcumference();
    const offset = curcumference - (val / 100) * curcumference;
    circle.style.strokeDashoffset = offset;
  };

  toggleAnimation = () => {
    this.shadowRoot
      .querySelector(".progress__ring")
      .classList.toggle("progress__ring_rotating");
  };

  toggleVisibility = () => {
    this.shadowRoot
      .querySelector(".progress__graph")
      .classList.toggle("progress__graph_hidden");
  };

  static get observedAttributes() {
    return ["percentage", "animated", "hidden"];
  }

  attributeChangedCallback() {
    const progressInput = this.shadowRoot.querySelector(".progress__input");
    const percentage = this.getAttribute("percentage");

    progressInput.value = percentage;
    this.updateCircle(percentage);
  }

  getCurcumference = () => {
    const circle = this.shadowRoot.querySelector(".progress__circle");
    const radius = circle.r.baseVal.value;
    const curcumference = 2 * Math.PI * radius;
    return curcumference;
  };

  connectedCallback() {
    const circle = this.shadowRoot.querySelector(".progress__circle");
    if (!circle) {
      console.error("Circle element not found");
      return;
    }

    const curcumference = this.getCurcumference();
    if (!curcumference) {
      console.error("Invalid circumference");
      return;
    }

    circle.style.strokeDasharray = `${curcumference} ${curcumference}`;

    const percentInput = this.shadowRoot.querySelector(".progress__input");
    if (!percentInput) {
      console.error("Percent input element not found");
      return;
    }

    percentInput.addEventListener("change", (evt) => {
      const percent = evt.target;

      if (percent.value > 100) {
        percent.value = 100;
      } else if (percent.value < 0) {
        percent.value = 0;
      }

      this.updateCircle(percent.value);
    });

    const animateState = this.shadowRoot.querySelector(
      '.progress__checkbox[name="animation"]'
    );
    if (!animateState) {
      console.error("Animation checkbox element not found");
      return;
    }

    animateState.addEventListener("change", (evt) => {
      this.toggleAnimation();
    });

    const hideState = this.shadowRoot.querySelector(
      '.progress__checkbox[name="hide"]'
    );
    if (!hideState) {
      console.error("Hide checkbox element not found");
      return;
    }

    hideState.addEventListener("change", (evt) => {
      this.toggleVisibility();
    });
  }

  disconnectedCallback() {
    const progressInput = this.shadowRoot.querySelector(".progress__input");
    if (progressInput) {
      progressInput.removeEventListener("change", (evt) => {
        const percent = evt.target;
        if (percent.value > 100) {
          percent.value = 100;
        } else if (percent.value < 0) {
          percent.value = 0;
        }
        setProgress(percent.value);
      });
    }

    const animateCheckbox = this.shadowRoot.querySelector(
      '.progress__checkbox[name="animation"]'
    );
    if (animateCheckbox) {
      animateCheckbox.removeEventListener("change", (evt) => {
        this.toggleAnimation();
      });
    }

    const hideCheckbox = this.shadowRoot.querySelector(
      '.progress__checkbox[name="hide"]'
    );
    if (hideCheckbox) {
      hideCheckbox.removeEventListener("change", (evt) => {
        this.toggleVisibility();
      });
    }
  }
}

export default ProgressBar;
