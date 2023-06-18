import { uid } from 'uid';

export const getUId = () => {
  return `${uid(10)}-${uid(10)}-${uid(10)}-${uid(10)}`;
};
