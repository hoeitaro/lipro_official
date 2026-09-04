import stylelintDeclarationBlockNoIgnoredProperties from "stylelint-declaration-block-no-ignored-properties";

export default {
  ignoreFiles: ["**/node_modules/**", "**/dist/**"],

  plugins: [stylelintDeclarationBlockNoIgnoredProperties],

  extends: ["stylelint-config-standard-scss", "stylelint-config-rational-order"],

  rules: {
    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "keyframes-name-pattern": null,
    "font-family-no-duplicate-names": null,
    "scss/dollar-variable-pattern": null,
    "custom-property-pattern": null,

    "scss/operator-no-newline-after": null,
    "scss/operator-no-newline-before": null,

    "rule-empty-line-before": [
      "always",
      {
        ignore: ["after-comment", "first-nested"],
      },
    ],
  },
};
