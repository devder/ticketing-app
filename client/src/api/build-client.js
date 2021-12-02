import axios from "axios";

function buildClient({ req }) {
  if (typeof window === "undefined") {
    // server
    return axios.create({
      baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req?.headers,
    });
  } else {
    // client
    return axios.create({ baseURL: "/" });
  }
}

export default buildClient;
