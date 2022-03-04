import bcrypt from "bcryptjs";

export const checkPwd = (pwd, hash) => {
  if (!bcrypt.compareSync(pwd, hash)) throw Error("Credentials invalid.");
};

export const genHash = async (pwd) => {
  pwd = pwd + "";
  try {
    isGoodPWD(pwd); // returns true or generates an error
    let pepper = 8;
    let salt = bcrypt.genSaltSync(pepper);
    let hash = bcrypt.hashSync(pwd + "", salt);
    return hash;
  } catch (error) {
    // console.warn(error);
    throw new Error(`${error.message}\nPlease try again.`);
  }
};

export const isGoodPWD = (pwd) => {
  pwd = pwd + "";
  let regex =
    /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[°§ß!@#$%&*()'+,-./:;<=>\\?[\]^_`{|}]).{6,}$/g;
  if (!regex.test(pwd)) throw Error("New Password is not strong enough!");
  return true;
};
