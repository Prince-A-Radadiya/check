import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Account = () => {

    const navigate = useNavigate();

    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    // Login
    const login = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:9000/login", {
                email,
                password,
            });

            if (res.data.token) {
                alert(res.data.message);

                localStorage.setItem("token", res.data.token);  // FIXED
                localStorage.setItem("role", res.data.role);

                // Redirect by role
                if (res.data.role === "admin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/");
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || "Server error");
        }
    };

    // Register
    const register = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:9000/register", {
                fullname: name,
                email,
                password,
            });

            if (res.data.token) {
                alert(res.data.message);

                localStorage.setItem("token", res.data.token);  // FIXED
                localStorage.setItem("role", res.data.role);

                if (res.data.role === "admin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/");
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || "Server error");
        }
    };

    return (
        <div className="container">
            <div className="account">
                <div className="bg"></div>

                <div className="panel">
                    <input type="radio" id="switch-open" name="switch" />
                    <input type="radio" id="switch-close" name="switch" />

                    {/* LOGIN */}
                    <div className="login">
                        <h1>LOGIN</h1>

                        <div className="group">
                            <input type="text"
                                placeholder="E-Mail"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                            />
                        </div>

                        <div className="group">
                            <input type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                            />
                        </div>

                        <input type="submit" value="LOGIN" onClick={login} />
                    </div>

                    {/* REGISTER */}
                    <div className="register">
                        <label className="button-open" htmlFor="switch-open"></label>
                        <label className="button-close" htmlFor="switch-close"></label>

                        <div className="inner">
                            <h1>REGISTER</h1>

                            <div className="group">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setname(e.target.value)}
                                />
                            </div>

                            <div className="group">
                                <input
                                    type="text"
                                    placeholder="E-Mail"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
                                />
                            </div>

                            <div className="group">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                />
                            </div>

                            <input type="submit" value="REGISTER" onClick={register} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Account;
