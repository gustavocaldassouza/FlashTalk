import { Button } from "@mui/material";
import { Link, redirect } from "react-router-dom";

function Root() {
  const handleClick = () => {
    console.log("Hello world");

    redirect("/register");
  };

  return (
    <Link style={{ textDecoration: "none" }} to="/register">
      <Button variant="contained" onClick={handleClick}>
        Hello world
      </Button>
    </Link>
  );
}

export default Root;
