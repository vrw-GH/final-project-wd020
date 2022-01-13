import {
  ModalProvider,
  Modal,
  useModal,
  ModalTransition,
} from "react-simple-hook-modal";
import "react-simple-hook-modal/dist/styles.css";
import "./_Page.css";
import about from './about.jpeg' 
import Firework from "./Firework.js"
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
          <span onDragEnd={handleClick}>-·≡ {APPDATA.INFO} ≡·-</span>
        </h2>
      </div>

      <div className="cont1">
      <div className='aboutimg1'>
        <h1 className=" aboutt"><Link to={'/sharing'}>Sharing</Link></h1>
        <div className='color-overlay'></div>
      </div>
      <div className='aboutimg2'>
        <h1 className=" aboutt"><Link to={'/recipes'}>Recipes</Link></h1>
        <div className='color-overlay'></div>
      </div>
      </div>
      <div className="lorem">
        <br />
        <span >{APPDATA.NAME.toUpperCase()}</span>
        <br/>
        <br/>
        <span >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste minima, ipsum dolorem adipisci delectus tempore veritatis aut totam enim sequi tenetur quasi veniam a? Modi autem quasi nostrum neque possimus!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste minima, ipsum dolorem adipisci delectus tempore veritatis aut totam enim sequi tenetur quasi veniam a? Modi autem quasi nostrum neque possimus!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste minima, ipsum dolorem adipisci delectus tempore veritatis aut totam enim sequi tenetur quasi veniam a? Modi autem quasi nostrum neque possimus!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste minima, ipsum dolorem adipisci delectus tempore veritatis aut totam enim sequi tenetur quasi veniam a? Modi autem quasi nostrum neque possimus!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste minima, ipsum dolorem adipisci delectus tempore veritatis aut totam enim sequi tenetur quasi veniam a? Modi autem quasi nostrum neque possimus!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste minima, ipsum dolorem adipisci delectus tempore veritatis aut totam enim sequi tenetur quasi veniam a? Modi autem quasi nostrum neque possimus!</span>
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