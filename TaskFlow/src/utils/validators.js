export const validateEmail = (email) => {

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);

};

export const validatePassword = (password) => {

  return password.length >= 8;

};

export const validateName = (name) => {

  return name.trim().length >= 2;

};