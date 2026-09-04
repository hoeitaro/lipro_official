type ErrorMap = {
  [key: string]: string;
};

export default class SsgRequestFormConfirmation {
  private form!: HTMLFormElement;
  private inputArea!: HTMLElement;
  private confirmArea!: HTMLElement;

  private confirmButton!: HTMLButtonElement;
  private backButton!: HTMLButtonElement;
  private submitButton!: HTMLButtonElement;

  private firstErrorItem: HTMLElement | null = null;
  private isSubmitting = false;

  private errorMessages: ErrorMap = {
    company: "※ 会社名を入力してください",
    contact_name: "※ ご担当者様名を入力してください",
    email: "※ メールアドレスを入力してください",
    email_confirm: "※ メールアドレスを入力してください",
    email_invalid: "※ 正しいメールアドレスを入力してください",
    email_mismatch: "※ メールアドレスが一致しません",
    inquiry_type: "※ ご依頼内容を選択してください",
    message: "※ お申し込み内容を入力してください",
  };

  private emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  constructor(selector = "[data-ssg-form-request]") {
    const form = document.querySelector<HTMLFormElement>(selector);
    if (!form) return;

    this.form = form;
    this.inputArea = form.querySelector(".form-input")!;
    this.confirmArea = form.querySelector(".form-conf")!;

    this.confirmButton = form.querySelector('[data-action="confirm"]')!;
    this.backButton = form.querySelector('[data-action="back"]')!;
    this.submitButton = form.querySelector('[data-action="send"]')!;

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

    this.form.addEventListener("submit", (e) => {
      if (this.isSubmitting) {
        e.preventDefault();
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

    const company = this.getValue("company");
    const contactName = this.getValue("contact_name");
    const email = this.getValue("email");
    const emailConfirm = this.getValue("email_confirm");
    const inquiryTypes = this.getCheckedValues("inquiry_type");
    const message = this.getValue("message");

    if (!company) valid = this.showError("company") && valid;
    if (!contactName) valid = this.showError("contact_name") && valid;

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

    if (inquiryTypes.length === 0) {
      valid = this.showCheckboxError("inquiry_type") && valid;
    }

    if (!message) valid = this.showError("message") && valid;

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

  private getCheckedValues(key: string): string[] {
    return Array.from(
      this.form.querySelectorAll<HTMLInputElement>(
        `input[type="checkbox"][data-field="${key}"]:checked`,
      ),
    ).map((el) => el.value);
  }

  // =====================
  // エラー表示
  // =====================
  private showError(key: string, messageKey: keyof ErrorMap = key): false {
    const field = this.form.querySelector<HTMLElement>(`[data-field="${key}"]`);
    if (!field) return false;

    const item = field.closest(".c-lower-table__item") as HTMLElement;
    const wrapper = field.closest(".c-lower-table__content") as HTMLElement;

    if (!this.firstErrorItem) this.firstErrorItem = item;

    field.classList.add("is-error");
    wrapper.appendChild(this.createError(this.errorMessages[messageKey]));
    return false;
  }

  private showCheckboxError(key: string): false {
    const fields = this.form.querySelectorAll<HTMLInputElement>(
      `input[type="checkbox"][data-field="${key}"]`,
    );
    if (!fields.length) return false;

    const item = fields[0].closest(".c-lower-table__item") as HTMLElement;
    const wrapper = fields[0].closest(".c-lower-table__content") as HTMLElement;

    if (!this.firstErrorItem) this.firstErrorItem = item;

    fields.forEach((f) => f.classList.add("is-error"));
    wrapper.appendChild(this.createError(this.errorMessages[key]));
    return false;
  }

  private createError(message: string): HTMLElement {
    const p = document.createElement("p");
    p.className = "c-error";
    p.textContent = message;
    return p;
  }

  private clearErrors(): void {
    this.form.querySelectorAll(".c-error").forEach((e) => e.remove());
    this.form
      .querySelectorAll(".is-error")
      .forEach((e) => e.classList.remove("is-error"));
  }

  // =====================
  // 確認画面反映
  // =====================
  private fillConfirm(): void {
    const confEls = this.form.querySelectorAll<HTMLElement>("[data-conf]");

    confEls.forEach((el) => {
      const key = el.dataset.conf;
      if (!key) return;

      // checkbox
      const checkedValues = this.getCheckedValues(key);
      if (checkedValues.length) {
        el.textContent = checkedValues.join("、");
        return;
      }

      // 通常 input / textarea
      const value = this.getValue(key);
      el.textContent = value || "—";
    });
  }

  // =====================
  // 画面切り替え
  // =====================
  private toggle(isConfirm: boolean): void {
    this.inputArea.style.display = isConfirm ? "none" : "";
    this.confirmArea.style.display = isConfirm ? "" : "none";
    window.scrollTo({ top: 0 });
  }
}
