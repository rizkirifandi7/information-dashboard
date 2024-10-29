/* eslint-disable react/prop-types */
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, userRole }) => {
	const isAuthenticated = !!Cookies.get("token");

	return isAuthenticated ? (
		<Component userRole={userRole} />
	) : (
		<Navigate to="/login" />
	);
};

export default PrivateRoute;
