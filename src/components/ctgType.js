const ctgTypes = {
  B: "Breakfast",
  L: "Lunch",
  D: "Dinner",
  S: "Dessert",
  X: "Xmas",
};

const ctgType = (code) => {
  return ctgTypes[code] || "";
};
export default ctgType;
