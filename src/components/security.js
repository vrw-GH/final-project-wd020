import bcrypt from "bcryptjs";

export const checkPwd = (pwd, hash) => {
  return bcrypt.compareSync(pwd, hash);
};

export const genHash = (pwd) => {
  pwd = pwd + "";
  try {
    isGoodPWD(pwd);
    let pepper = 8;
    let salt = bcrypt.genSaltSync(pepper);
    let hash = bcrypt.hashSync(pwd + "", salt);
    return hash;
  } catch (error) {
    console.warn(error);
    throw Error(
      `${error.message}\nPlease try again or enter a different password.`
    );
  }
};

export const isGoodPWD = (pwd) => {
  pwd = pwd + "";
  let regex =
    /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[°§ß!@#$%&*()'+,-./:;<=>\\?[\]^_`{|}]).{6,}$/g;
  if (!regex.test(pwd)) throw Error("Need a stronger password!");
  return true;
};
