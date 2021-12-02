import { useEffect } from "react";
import Router from "next/router";
import useRequest from "hooks/useRequest";

function SignOut() {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out</div>;
}

export default SignOut;
