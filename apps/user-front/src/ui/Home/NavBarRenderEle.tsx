import { Link } from "react-router-dom";
import Button from "../share/Button";

const NavBarRenderEle = () => {
  return (
    <div className="space-x-2">
      <Button>
        <Link to={"/auth/login"}>LogIn</Link>
      </Button>
      <Button>
        <Link to={"/auth/register"}>Register</Link>
      </Button>
    </div>
  );
};

export default NavBarRenderEle;
