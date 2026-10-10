import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div>
      <h1>Oh no, this route doesn't exist!</h1>
      <Link to="/">
        Go back to the home page by clicking here!
      </Link>
    </div>
  );
};

export default ErrorPage;
