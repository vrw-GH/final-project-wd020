import {
  ModalProvider,
  Modal,
  useModal,
  ModalTransition,
} from "react-simple-hook-modal";
import easteregg from "../media/easteregg.png";
import Confetti from "../components/confetti.js";
import "react-simple-hook-modal/dist/styles.css";

const PageTitle = ({ titleText }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const handleClick = (e) => {
    e.preventDefault();
    if (e.nativeEvent.srcElement.data === titleText) openModal();
  };
  return (
    <>
      <div className="page-title">
        <span className="about-title" title="There's magic here!"
          onDragEnd={handleClick}>
          -•≡ {titleText} ≡•-
        </span>
      </div>
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
    </>
  );
};

export default PageTitle;
