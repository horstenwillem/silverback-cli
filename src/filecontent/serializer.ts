export function createSerializer(name, plural) {
  return `
import { Serializer } from 'jsonade';

export const ${name}Serializer = new Serializer('${plural}', {
  keyForAttribute: 'camelCase',
  attributes: [
    'id',
  ],
});
`;
}
