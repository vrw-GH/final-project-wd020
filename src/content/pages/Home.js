import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading.js";
import PageTitle from "../../components/PageTitle.js";
import "./Home.css";

const Home = ({ APPDATA }) => {
  const [err, setErr] = useState("Site is Loading...");

  window.scrollTo(0, 0);

  useEffect(() => {
    setErr("");
    return () => { };
  }, []);

  return (
    <div className="page-container" >
      <PageTitle titleText={APPDATA.INFO} />
      <div className="page-box col-8" style={{ width: "90%", }}>
        {err ? (
          <Loading text={err} />
        ) : (
          <>
            <div className="large-btns">
              <Link to={"/sharing"}>
                <div className="sharing-img">
                  <h1 className="sharing-btn">Sharing</h1>
                  <div className="sharing-overlay"></div>
                </div>
              </Link>
              <Link to={"/recipes"}>
                <div className="recipes-img">
                  <h1 className="recipes-btn">Recipes</h1>
                  <div className="recipes-overlay"></div>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="lorem">
        <span>-•≡ <b>{APPDATA.NAME.toUpperCase()}</b> ≡•-</span>
        <br />
        <br />
        <span>
          Animal instinct is to protect one's food and not to share. Ever toss
          bread to birds or watch a dog eating from his bowl snap at any other
          dog daring to come close? Humans can prove their evolution through the
          sharing of food. Sharing food demonstrates investment in the survival
          of those being shared with. The prime example is parents providing
          nutritious food for their children to become healthy and strong.
          Everyone eats, thus "breaking bread" is something everyone can take
          part in no matter their religion, caste, color, creed, age, gender or
          social status. When eating together, people become equals. Sharing
          food provides an opportunity to spend time sharing stories, discussing
          politics, and gossiping. As drinks are poured, their are opportunities
          to make toasts honoring accomplishment and celebrating successes.
          Courting often revolves around food… men buying meals for women,
          families having suitors for dinner to meet their daughter, etc Eating
          food that another has prepared is a way of expressing vulnerability,
          as you must trust that the food they are providing you is not
          poisonous. When vulnerability is validated trust is strengthened
          between people.
          <br />
          <br />
          <details>
            <summary title="Click to see"><b>Side story about sharing food… </b></summary>
            After many years of attending Burning Man (an event in the desert
            where people practice radical self-reliance) I noticed a pattern:
            people would pack way more food than they needed, but horde it for the
            first few days of the week-long event… then begin to offer food
            liberally towards the end of the week when they realized how much
            extra food they had. Based upon this observation, the following years
            I packed only enough food to last the first few days of the event and
            shared my food with my campmates. Like clockwork, because I had shared
            early in the week… I was able to enjoy delicious meals throughout the
            end of the event as those around me began to unload their stashes.
          </details>
        </span>
      </div>
    </div>
  );
};
export default Home;
