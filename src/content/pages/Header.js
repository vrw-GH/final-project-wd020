import Marquee from "../../components/Marquee.js";
import "./_General.css"

const Header = ({ APPDATA }) => {
  return (
    <div>
      <div>
        <div>
          {APPDATA.MODE.substring(0, 4).toUpperCase() !== "PROD" ? (
            <Marquee title="Change MODE in process.env">
              App is in {APPDATA.MODE.toUpperCase()} Mode (ver: {APPDATA.VER}) - this will not show in PROD mode
            </Marquee>
          ) : null}
        </div>
      </div>
    </div >
  );
};
export default Header;
