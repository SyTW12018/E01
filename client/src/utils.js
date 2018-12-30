import removeAccents from 'remove-accents';
import { StripChar } from 'stripchar';

const formatName = (str) => {
  let name = str;
  name = name.toLowerCase();
  name = name.replace(/ /g, '_');
  name = removeAccents(name);
  name = StripChar.RSExceptUnsAlpNum(name, '_');
  return name;
};

export {
  formatName,
};
