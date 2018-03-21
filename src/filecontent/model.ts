
export function createModel(name) {
  return `
export interface ${name} {
  id?: string;
}
`;
}
