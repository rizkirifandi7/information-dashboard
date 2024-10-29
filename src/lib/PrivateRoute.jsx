/* eslint-disable react/prop-types */
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, userRole }) => {
	const token = Cookies.get("token");
	const isAuthenticated = !!token;

	// Decode the token to get user information
	const user = token ? jwtDecode(token) : null;

	// Check if the user is authenticated and has the required role
	const hasAccess =
		isAuthenticated && (!userRole || (user && user.role === userRole));

	return hasAccess ? (
		<Component userRole={userRole} />
	) : (
		<Navigate to="/login" />
	);
};

export default PrivateRoute;
