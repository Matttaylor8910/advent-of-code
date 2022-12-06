export function reverse(str): string {
  return [...str].reverse().join('');
}

export function isAllUniqueChars(str: string): boolean {
  return new Set(str).size == str.length;
}