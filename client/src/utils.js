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

const getAxiosErrors = (e) => {
  if (!e || !e.response || !e.response.data) return [];

  let errors = [];
  const responseErrors = e.response.data.errors;
  if (responseErrors && Array.isArray(responseErrors)) {
    errors = responseErrors.map((error) => {
      if (typeof error === 'object') return (error.msg ? error.msg : 'Unknown error');
      return error;
    });
  } else {
    errors = [ e.message ];
  }

  return errors;
};

export {
  formatName, getAxiosErrors,
};
