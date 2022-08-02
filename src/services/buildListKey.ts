import { LIST_KEY } from '../consts';

const buildListKey = (key: string) => `${LIST_KEY}:${key}`;

export default buildListKey;
