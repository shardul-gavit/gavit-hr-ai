import { Navigate } from "react-router-dom";
import { useAuth, ROLE_HOME } from "@/store/Auth";

const Index = () => {
  const { user } = useAuth();
  return <Navigate to={user ? ROLE_HOME[user.role] : "/login"} replace />;
};

export default Index;
