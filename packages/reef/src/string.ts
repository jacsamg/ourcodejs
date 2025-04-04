export function capitalizeWords(unformattedWords: string) {
  const wordBreaker = ' ';
  const lowercaseWords = unformattedWords.trim().toLowerCase().split(wordBreaker);

  const capitalizedWords = lowercaseWords.map((word: string) => {
    const firstLetterOfWord = word.charAt(0).toUpperCase();
    const restLettersOfWord = word.slice(1);

    return firstLetterOfWord + restLettersOfWord;
  });
  const capitalizedText = capitalizedWords.join(wordBreaker);

  return capitalizedText;
}

export function naturalSort(a: string, b: string): number {
  // Alphanumeric sort
  return a.localeCompare(b, 'es', { numeric: true });
}

export function getRandomCharset(size: number) {
  const charset = "abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (var i = 0; i < size; i++) {
    result += charset[Math.floor(Math.random() * charset.length)];
  }

  return result;
}

export function getConvenientStringFormat(value: string): string {
  // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function getOnlyAlphaNumeric(
  value: string,
  keepWhitespace = true,
  keepHyphen = true,
  keepUnderscore = true
): string {
  let rules = "^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ";

  if (keepWhitespace) rules = rules + "\\s";
  if (keepHyphen) rules = rules + "\\-";
  if (keepUnderscore) rules = rules + "\\_";

  return value.replace(new RegExp(`[${rules}]`, "gi"), "");
}

export function checkEmail(value: string): boolean {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(value);
}

export function toBase64InBrowser(value: string): string {
  return btoa(value);
}

export function fromBase64InBrowser(value: string): string {
  return atob(value);
}
