import axios from "axios";
import Cookies from "js-cookie";

const errorHandler = (error, message) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  if (APPDATA.MODE.substring(0, 3).toUpperCase() === "DEV") {
    console.log(error.response);
    console.log("Orig. " + (JSON.stringify(error?.response) || error));
  }
  throw new Error(
    `${message}.\n ${error?.response?.data?.info?.message ||
    error?.response?.statusText ||
    error?.response?.data?.error ||
    error
    }`
  );
};

export const getCategories = async () => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  try {
    const results = await axios.get(`${APPDATA.BACKEND}/api/categories/`);
    if (!results.data.tuples[0]) throw new Error("No Categories Data.");
    return results.data.tuples;
  } catch (error) {
    alert("Data Error: Categories \n" + error.message);
    return []; // Empty "categories"
  }
};

export const getIngredients = async () => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  try {
    const results = await axios.get(`${APPDATA.BACKEND}/api/ingredients/`);
    if (!results.data.tuples[0]) throw new Error("No Ingredients Data.");
    const finalData = await results.data.tuples.map((obj) => ({
      checked: false,
      ...obj,
    }));
    const sortedData = await finalData.sort((a, b) => {
      let nameA = a.ingredient_name.toUpperCase();
      let nameB = b.ingredient_name.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    return sortedData;
  } catch (error) {
    alert("Data Error: Ingredients \n" + error.message);
    return [
      {
        checked: false,
        ingredient_id: 0,
        ingredient_name: "Error: Ingredient library not found.",
      },
    ];
  }
};

export const getRecipes = async (filterItems) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  try {
    let results = await axios.get(`${APPDATA.BACKEND}/api/recipes/`);
    if (!results.data.tuples[0]) throw new Error("No Recipes Data.");
    if (filterItems) {
      results = await results.data.tuples.filter(filterItems);
    }
    return results;
  } catch (error) {
    alert("Data Error: Recipes \n" + error.message);
    return [];
  }
};

export const get1Recipe = async (id) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  try {
    const results = await axios.get(`${APPDATA.BACKEND}/api/recipes/${id}`);
    if (!results.data.tuples[0]) throw new Error("No Recipe Data.");
    return results.data.tuples[0];
  } catch (error) {
    errorHandler(error, "Data Error: Cannot load this Recipe");
  }
};

// await axios.post(`${APPDATA.BACKEND}/api/recipes`, info);
export const postRecipe = async (info) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  try {
    const results = await axios.post(`${APPDATA.BACKEND}/api/recipes`, info);
    if (!results.data.tuples[0]) throw new Error("Error posting recipe.");
    return results.data.tuples[0];
  } catch (error) {
    errorHandler(error, "Data Error: Cannot load this Recipe");
  }
};

export const getUserLikes = async (user) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const headers = { headers: { authorization: currentUser.token } };
  const token1 = Cookies.get("sharemyfood");
  console.log("cookie: " + token1); //! no data!??????????????????
  try {
    // const results = await axios.get(`${BACKEND}/api/users/${user}`);
    const results = await axios.get(
      `${APPDATA.BACKEND}/api/users/${user}`,
      headers
    );
    if (!results.data.tuples[0]) throw new Error("No User Data.");
    let res2 = results.data.tuples[0].likes ? results.data.tuples[0].likes : [];
    return res2;
  } catch (error) {
    errorHandler(error, "Data Error: Cannot load this Recipe");
  }
};

export const postUserLike = async (id, likes) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const options = { headers: { authorization: currentUser.token } };
  const body = { likes };
  try {
    await axios.post(`${APPDATA.BACKEND}/api/users/${id}`, body, options);
    return;
  } catch (error) {
    errorHandler(error, "Data Error: Cannot post likes");
  }
};

export const userLogin = async (username) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  try {
    const result = await axios.post(
      `${APPDATA.BACKEND}/auth/login/${username}`
    );
    if (!result.data.info.result) throw Error(result.data.info.message);
    const retObj = result.data.tuples[0];
    retObj.token = result.data.token;
    return retObj;
  } catch (error) {
    errorHandler(error, "Data Error: Cannot get login");
  }
};

export const userCreate = async (item) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  try {
    const result = await axios.post(`${APPDATA.BACKEND}/api/users`, item);
    if (!result.data.info.result) throw Error(result.data.info.message);
    const retObj = result.data.tuples[0];
    retObj.token = result.data.token;
    retObj.message = result.data.info.message;
    return retObj;
  } catch (error) {
    errorHandler(error, "Data Error: cannot do login");
  }
};

export const getSharedata = async () => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  try {
    const results = await axios.get(`${APPDATA.BACKEND}/api/shareitems`);
    if (!results.data.tuples) throw new Error("No sharing Data.");
    return results.data.tuples;
  } catch (error) {
    errorHandler(error, "Data Error: Cannot load sharing data");
  }
};

export const getShareitems = async (user) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  try {
    const results = await axios.get(
      `${APPDATA.BACKEND}/api/shareitems/${user}`
    );
    if (!results.data.tuples) return null;
    return results.data.tuples;
  } catch (error) {
    errorHandler(error, "Data Error: Cannot load sharing data");
  }
};

export const setShareitems = async (postAPI, submitInfo) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));

  try {
    await axios.post(
      `${APPDATA.BACKEND}/api/shareitems${postAPI}`, // postAPI has "/" or ""
      submitInfo
    );
    return;
  } catch (error) {
    errorHandler(error, "Data Error: Likes update un-successfull.");
  }
};

export const getUser = async (userName) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  console.log(APPDATA);
  const headers = { headers: { authorization: currentUser.token } };
  try {
    const results = await axios.get(
      `${APPDATA.BACKEND}/api/users/${userName}`,
      headers
    );
    if (!results.data.tuples[0]) throw new Error("No user data.");
    return results.data.tuples[0];
  } catch (error) {
    errorHandler(error, "Data Error: Cannot load user data");
  }
};

export const getCity = async (plz) => {
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  try {
    const results = await axios.get(`${APPDATA.BACKEND}/api/plz-de/${plz}`);
    if (!results.data.tuples[0]) throw new Error();
    return results.data.tuples[0];
  } catch (error) {
    errorHandler(error, "No data found :(");
  }
};

export const updateUser = async (userName, info) => {
  userName.toLowerCase();
  const APPDATA = JSON.parse(sessionStorage.getItem("APPDATA"));
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const headers = { headers: { authorization: currentUser.token } };
  try {
    const results = await axios.post(
      `${APPDATA.BACKEND}/api/users/${userName}`,
      info,
      headers
    );
    if (!results.data.info.result) throw new Error(results.data.info.message);
    return results.data.tuples[0];
  } catch (error) {
    errorHandler(error, "Data Error: Did not update");
  }
};
