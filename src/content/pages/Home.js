import Header from "./Header";
import Categories from "./Categories";
import "./Home.css";

const Home = ({ loading, categories, APPDATA }) => {
  return (
    <>
      <Header APPDATA={APPDATA} />
      <Categories categories={categories} BACKEND={APPDATA.BACKEND} />
    </>
  );
};

export default Home;
