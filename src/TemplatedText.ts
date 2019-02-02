import { Text, TextStyleOptions } from "pixi.js";

export default class TemplatedText extends Text {
  private template: string;

  constructor(template: string, initialText: string, style: TextStyleOptions) {
    super(initialText, style);

    this.template = template;
  }

  setValues(values: any) {
    this.text = Object.keys(values).reduce(
      (template, key) => template.replace(`{{${key}}}`, values[key]),
      this.template
    );
  }
}
