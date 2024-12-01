import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
const App = () => {
    return (_jsxs(Router, { children: [_jsx(Navbar, {}), _jsx("main", { children: _jsx(Routes, {}) })] }));
};
export default App;
