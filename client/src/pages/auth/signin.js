import { useState } from "react";
import { useRouter } from "next/router";
import useRequest from "hooks/useRequest";

const Signup = () => {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const { email, password } = data;
  const { doRequest, errors } = useRequest({
    method: "post",
    url: "/api/users/signin",
    body: { email, password },
    onSuccess: () => router.push("/"),
  });

  const handleInputChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="email" value={email} onChange={handleInputChange} className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" name="password" value={password} onChange={handleInputChange} className="form-control" />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">
        Sign In
      </button>
    </form>
  );
};

export default Signup;
