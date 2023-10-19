import "./Marquee.css"

const Marquee = ({ title, children }) => {
   return (
      <div className="marquee" title={title}>
         <p>{children}</p>
      </div>);
};

export default Marquee