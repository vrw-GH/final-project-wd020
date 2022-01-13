import {
  ModalProvider,
  Modal,
  useModal,
  ModalTransition,
} from "react-simple-hook-modal";
import "react-simple-hook-modal/dist/styles.css";
import "./_Page.css";
import about from "./about.jpeg";
import Firework from "./Firework.js";
import { Link } from "react-router-dom";

const About = ({ APPDATA }) => {
  const { isModalOpen, openModal, closeModal } = useModal();

  const handleClick = (e) => {
    e.preventDefault();
    if (e.nativeEvent.srcElement.data === APPDATA.INFO) openModal();
  };

  return (
    <div
      className="page-container"
      style={{
        backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
      }}
    >
      <div className="page-title">
        <h2>
          {/* <Firework/> */}
          <span onDragEnd={handleClick}>-‧≡ {APPDATA.INFO} ≡‧-</span>
        </h2>
      </div>

      <div className="cont1">
        <Link to={"/sharing"}>
          <div className="aboutimg1">
            <h1 className=" aboutt">Sharing</h1>
            <div className="color-overlay"></div>
          </div>
        </Link>
        <Link to={"/recipes"}>
          <div className="aboutimg2">
            <h1 className=" aboutt">Recipes</h1>
            <div className="color-overlay"></div>
          </div>
        </Link>
      </div>
      <div>
        <br />
        <span className="page-title-lg">{APPDATA.NAME.toUpperCase()}</span>
      </div>
      <ModalProvider>
        <Modal
          id="any-unique-identifier"
          isOpen={isModalOpen}
          transition={ModalTransition.BOTTOM_UP}
        >
          <div
            // className="page-box col"
            onClick={closeModal}
          >
            {/* <img src={APPDATA.FOOTERIMG} alt="footer" /> */}
            {APPDATA.DESCRIPTION}
          </div>
        </Modal>
      </ModalProvider>
    </div>
  );
};
export default About;
