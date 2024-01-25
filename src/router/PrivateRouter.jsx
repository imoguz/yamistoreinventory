import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = () => {
  const user = "A";

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouter;
