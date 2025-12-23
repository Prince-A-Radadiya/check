import { useState, useEffect } from "react";
import { useCart } from "../../Context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserSettings = () => {
  const { user, setUser, logout } = useCart();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 SYNC USER DATA INTO INPUTS
  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setEmail(user.email || "");
      setPreview(
        user.profile
          ? `http://localhost:9000${user.profile}`
          : "/img/user.webp"
      );
    }
  }, [user]);

  // UPDATE USER
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email);
      if (password) formData.append("password", password);
      if (profile) formData.append("profile", profile);

      const res = await axios.put(
        "http://localhost:9000/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage("Profile updated successfully!");
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  // DELETE ACCOUNT
  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:9000/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      logout();
      navigate("/");

    } catch (err) {
      setMessage("Delete failed");
    }
  };

  return (
    <div className="user-settings container py-4">
      <h3>User Settings</h3>

      {message && <p className="text-success">{message}</p>}

      {/* PROFILE IMAGE */}
      <div className="mb-3 text-center">
        <img
          src={preview}
          alt="profile"
          className="rounded-circle"
          width="120"
          height="120"
        />
        <input
          type="file"
          className="form-control mt-2"
          accept="image/*"
          onChange={(e) => {
            setProfile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />
      </div>

      <form onSubmit={handleUpdate}>
        <div className="form-group my-2">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>

        <div className="form-group my-2">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group my-2">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
          />
        </div>

        <button type="submit" className="btn btn-primary my-2">
          Update Profile
        </button>
      </form>

      <hr />

      <button className="btn btn-danger" onClick={handleDelete}>
        Delete Account
      </button>

      <button
        className="btn btn-secondary ms-2"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default UserSettings;
