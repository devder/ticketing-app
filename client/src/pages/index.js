import buildClient from "api/build-client";

const Home = ({ currentUser }) => {
  return <h1>You are {!currentUser && "NOT"} signed in</h1>;
};

export async function getServerSideProps(ctx) {
  const {
    data: { currentUser },
  } = await buildClient(ctx).get("/api/users/currentuser");
  return {
    props: { currentUser },
  };
}

// Home.getInitialProps = async context => {
//   const { data } = await buildClient(context).get("/api/users/currentuser");
//   return data;
// };

export default Home;
