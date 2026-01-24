import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./UseAdminAuth";
import type { JSX } from "react/jsx-dev-runtime";

type Props = {
  children: JSX.Element;
};

export default function AdminProtectedRoute({ children }: Props) {
  const { loading, isAdmin } = useAdminAuth();

  if (loading) {
    return <p className="p-6">Checking admin access...</p>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
