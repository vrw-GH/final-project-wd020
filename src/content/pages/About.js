import {
  ModalProvider,
  Modal,
  useModal,
  ModalTransition,
} from "react-simple-hook-modal";
import "react-simple-hook-modal/dist/styles.css";
import "./_Page.css";

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
          <span onDragEnd={handleClick}>-·≡ {APPDATA.INFO} ≡·-</span>
        </h2>
      </div>

      <div className="page-box col-9">
        <span className="page-title-sm">About Us</span>
        <br />
        <span className="page-title-lg">{APPDATA.NAME.toUpperCase()}</span>
      </div>
      <ModalProvider>
        <Modal
          id="any-unique-identifier"
          isOpen={isModalOpen}
          transition={ModalTransition.BOTTOM_UP}
        >
          <div className="page-box col" onClick={closeModal}>
            <span className="page-title-sm">About Us</span>
          </div>
        </Modal>
      </ModalProvider>
    </div>
  );
};
export default About;
