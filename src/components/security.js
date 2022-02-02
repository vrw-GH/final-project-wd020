import bcrypt from "bcryptjs";

export const checkPwd = (pwd, hash) => {
  return bcrypt.compareSync(pwd, hash);
};

export const genHash = (pwd) => {
  pwd = pwd + "";
  let pepper = 8;
  let regex =
    /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[°§ß!@#$%&*()'+,-./:;<=>\\?[\]^_`{|}]).{6,}$/g;
  try {
    if (!regex.test(pwd)) throw Error(); // .text matches with integers as well
    let salt = bcrypt.genSaltSync(pepper);
    let hash = bcrypt.hashSync(pwd + "", salt);
    return hash;
  } catch (error) {
    throw Error("Need a stronger password!");
  }
};
