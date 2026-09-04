type ErrorMap = {
  [key: string]: string;
};

export default class SsgFormConfirmation {
  private form!: HTMLFormElement;
  private inputArea!: HTMLElement;
  private confirmArea!: HTMLElement;

  private confirmButton!: HTMLButtonElement;
  private backButton!: HTMLButtonElement;
  private submitButton!: HTMLButtonElement;

  private firstErrorItem: HTMLElement | null = null;
  private isSubmitting = false;

  private errorMessages: ErrorMap = {
    name: "お名前を入力してください",
    email: "メールアドレスを入力してください",
    email_confirm: "メールアドレスを入力してください",
    email_invalid: "正しいメールアドレスを入力してください",
    email_mismatch: "メールアドレスが一致しません",
    subject: "件名を選択してください",
    message: "お問い合わせ内容を入力してください",
  };

  private emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  constructor(selector = "[data-ssg-form]") {
    const form = document.querySelector<HTMLFormElement>(selector);
    if (!form) return;

    this.form = form;

    const inputArea = form.querySelector<HTMLElement>(".form-input");
    const confirmArea = form.querySelector<HTMLElement>(".form-conf");

    const confirmButton = form.querySelector<HTMLButtonElement>(
      '[data-action="confirm"]',
    );
    const backButton = form.querySelector<HTMLButtonElement>(
      '[data-action="back"]',
    );
    const submitButton = form.querySelector<HTMLButtonElement>(
      '[data-action="send"]',
    );

    if (
      !inputArea ||
      !confirmArea ||
      !confirmButton ||
      !backButton ||
      !submitButton
    ) {
      return;
    }

    this.inputArea = inputArea;
    this.confirmArea = confirmArea;

    this.confirmButton = confirmButton;
    this.backButton = backButton;
    this.submitButton = submitButton;

    this.init();
  }

  // =====================
  // 初期化
  // =====================
  private init(): void {
    this.confirmArea.style.display = "none";

    this.confirmButton.addEventListener("click", () => {
      this.clearErrors();

      if (!this.validate()) return;

      this.fillConfirm();
      this.toggle(true);
    });

    this.backButton.addEventListener("click", () => {
      this.toggle(false);
    });

    this.form.addEventListener("submit", (event) => {
      if (this.isSubmitting) {
        event.preventDefault();
        return;
      }

      this.isSubmitting = true;
      this.submitButton.disabled = true;
      this.submitButton.textContent = "送信中...";
    });
  }

  // =====================
  // バリデーション
  // =====================
  private validate(): boolean {
    let valid = true;

    this.firstErrorItem = null;

    const name = this.getValue("name");
    const email = this.getValue("email");
    const emailConfirm = this.getValue("email_confirm");
    const subject = this.getRadioValue("subject");
    const message = this.getValue("message");

    if (!name) {
      valid = this.showError("name") && valid;
    }

    if (!email) {
      valid = this.showError("email") && valid;
    } else if (!this.emailPattern.test(email)) {
      valid = this.showError("email", "email_invalid") && valid;
    }

    if (!emailConfirm) {
      valid = this.showError("email_confirm") && valid;
    } else if (!this.emailPattern.test(emailConfirm)) {
      valid = this.showError("email_confirm", "email_invalid") && valid;
    }

    if (email && emailConfirm && email !== emailConfirm) {
      valid = this.showError("email_confirm", "email_mismatch") && valid;
    }

    if (!subject) {
      valid = this.showRadioError("subject") && valid;
    }

    if (!message) {
      valid = this.showError("message") && valid;
    }

    if (!valid && this.firstErrorItem) {
      (this.firstErrorItem as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    return valid;
  }

  // =====================
  // 値取得
  // =====================
  private getValue(key: string): string {
    const field = this.form.querySelector<
      HTMLInputElement | HTMLTextAreaElement
    >(`[data-field="${key}"]`);

    return field?.value.trim() ?? "";
  }

  private getRadioValue(key: string): string {
    const checked = this.form.querySelector<HTMLInputElement>(
      `input[type="radio"][data-field="${key}"]:checked`,
    );

    return checked?.value ?? "";
  }

  // =====================
  // エラー表示
  // =====================
  private showError(key: string, messageKey: keyof ErrorMap = key): false {
    const field = this.form.querySelector<HTMLElement>(`[data-field="${key}"]`);

    if (!field) return false;

    const item = field.closest<HTMLElement>(".c-lower-table__item");
    const wrapper = field.closest<HTMLElement>(".c-lower-table__content");

    if (!item || !wrapper) return false;

    if (!this.firstErrorItem) {
      this.firstErrorItem = item;
    }

    field.classList.add("is-error");
    wrapper.appendChild(this.createError(this.errorMessages[messageKey]));

    return false;
  }

  private showRadioError(key: string): false {
    const radios = this.form.querySelectorAll<HTMLInputElement>(
      `input[type="radio"][data-field="${key}"]`,
    );

    if (!radios.length) return false;

    const item = radios[0].closest<HTMLElement>(".c-lower-table__item");
    const wrapper = radios[0].closest<HTMLElement>(".c-lower-table__content");

    if (!item || !wrapper) return false;

    if (!this.firstErrorItem) {
      this.firstErrorItem = item;
    }

    radios.forEach((radio) => {
      radio.classList.add("is-error");
    });

    wrapper.appendChild(this.createError(this.errorMessages[key]));

    return false;
  }

  private createError(message: string): HTMLElement {
    const error = document.createElement("p");

    error.className = "c-error";
    error.textContent = message;

    return error;
  }

  private clearErrors(): void {
    this.form.querySelectorAll(".c-error").forEach((error) => {
      error.remove();
    });

    this.form.querySelectorAll(".is-error").forEach((field) => {
      field.classList.remove("is-error");
    });
  }

  // =====================
  // 確認画面反映
  // =====================
  private fillConfirm(): void {
    const confirmElements =
      this.form.querySelectorAll<HTMLElement>("[data-conf]");

    confirmElements.forEach((element) => {
      const key = element.dataset.conf;

      if (!key) return;

      const radioValue = this.getRadioValue(key);

      if (radioValue) {
        element.textContent = radioValue;
        return;
      }

      const value = this.getValue(key);

      element.textContent = value || "—";
    });
  }

  // =====================
  // 画面切り替え
  // =====================
  private toggle(isConfirm: boolean): void {
    this.inputArea.style.display = isConfirm ? "none" : "";
    this.confirmArea.style.display = isConfirm ? "" : "none";

    const contact = document.querySelector<HTMLElement>("#contact");

    contact?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}
