type StrType =
  | "camelCase"
  | "kebabCase"
  | "snakeCase"
  | "pascalCase"
  | "sentenceCase"
  | "titleCase"
  | "lowerCase"
  | "upperCase";

export function firstLetterUppercase(str: string, strType?: StrType): string {
  switch (strType) {
    case "camelCase":
      return firstLetterUppercaseCamelCase(str);
    case "kebabCase":
      return firstLetterUppercaseKebabCase(str);
    case "snakeCase":
      return firstLetterUppercaseSnakeCase(str);
    case "pascalCase":
      return firstLetterUppercasePascalCase(str);
    case "sentenceCase":
      return firstLetterUppercaseSentenceCase(str);
    case "titleCase":
      return firstLetterUppercaseTitleCase(str);
    case "lowerCase":
      return firstLetterUppercaseLowerCase(str);
    case "upperCase":
      return firstLetterUppercaseUpperCase(str);
    default:
      return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

function firstLetterUppercaseCamelCase(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function firstLetterUppercaseKebabCase(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

function firstLetterUppercaseSnakeCase(str: string): string {
  return str
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("_");
}

function firstLetterUppercasePascalCase(str: string): string {
  return firstLetterUppercaseCamelCase(str);
}

function firstLetterUppercaseSentenceCase(str: string): string {
  return str
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(".");
}

function firstLetterUppercaseTitleCase(str: string): string {
  return str
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function firstLetterUppercaseLowerCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function firstLetterUppercaseUpperCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
