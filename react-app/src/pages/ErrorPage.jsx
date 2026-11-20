import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex text-center content-center align-middle p-5 rounded bg-light shadow-sm">
      <h1 className="text-danger">Oh no, this route doesn't exist!</h1>
      <Link to={document.referrer || '/'} className="btn btn-primary">
        Go back to the home page by clicking here!
      </Link>
    </div>
  );
};

export default ErrorPage;
