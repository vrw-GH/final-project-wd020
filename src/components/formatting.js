export const datify = (dt) => {
  let x = typeof dt;
  // console.log(x);
  if (!dt) return "";
  try {
    x = new Date(dt).toLocaleDateString();
  } catch (error) {
    x = "invalid date";
  }
  return x;
};
