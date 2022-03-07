import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ModalProvider,
  Modal,
  useModal,
  ModalTransition,
} from "react-simple-hook-modal";
import Loading from "../../components/Loading";
import easteregg from "../../media/easteregg.png";
import Confetti from "../../components/confetti";
import "react-simple-hook-modal/dist/styles.css";
import "./_Page.css";

const About = ({ APPDATA }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const [err, setErr] = useState("Site is Loading...");

  window.scrollTo(0, 0);

  useEffect(() => {
    setErr("");
    return () => {};
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (e.nativeEvent.srcElement.data === APPDATA.INFO) openModal();
  };

  return (
    <div
      className="page-container"
      style={{
        backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
        marginBottom: "0",
      }}
    >
      <div className="page-title">
        <h2 className="home-title">
          <span className="about-title" onDragEnd={handleClick}>
            -•≡ {APPDATA.INFO} ≡•-
          </span>
        </h2>
      </div>
      <div
        className="page-box col-8"
        style={{
          width: "90%",
        }}
      >
        {err ? (
          <Loading text={err} />
        ) : (
          <div className="cont1">
            <Link to={"/sharing"}>
              <div className="aboutimg1">
                <h1 className=" aboutt">Sharing</h1>
                <div className="color-overlay1"></div>
              </div>
            </Link>
            <Link to={"/recipes"}>
              <div className="aboutimg2">
                <h1 className=" aboutt2">Recipes</h1>
                <div className="color-overlay2"></div>
              </div>
            </Link>
          </div>
        )}
      </div>
      <div className="lorem">
        <br />
        <span>{APPDATA.NAME.toUpperCase()}</span>
        <br />
        <br />
        <span className="normal-about">
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
          <span className="Bold-about">Side story about sharing food…</span>
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
        </span>
      </div>
      <br />

      {/* <img style={{marginBottom:"20px"}} width={100} height={100} src={newLogo} alt=""/> */}

      <ModalProvider>
        <Modal
          id="any-unique-identifier"
          isOpen={isModalOpen}
          transition={ModalTransition.BOTTOM_UP}
        >
          <div className="easteregg-box" onClick={closeModal}>
            <span>
              <img className="easteregg-img" src={easteregg} alt="" />
              <Confetti />
            </span>
          </div>
        </Modal>
      </ModalProvider>
    </div>
  );
};
export default About;
