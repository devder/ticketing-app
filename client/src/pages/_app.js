import "bootstrap/dist/css/bootstrap.css";
import buildClient from "api/build-client";
import Header from "components/header";
import App from "next/app";

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </>
  );
}

MyApp.getInitialProps = async appContext => {
  const { data } = await buildClient(appContext.ctx).get("/api/users/currentuser");
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, ...data };
};

export default MyApp;

// MyApp.getInitialProps = async appContext => {
//   const client = buildClient(appContext.ctx);
//   const { data } = await client.get("/api/users/currentuser");

//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext, client, data.currentUser);

//   let pageProps = {};
//   // usually next will not call the other page(s) getInitialProps for us we do it by ourselves here
//   if (appContext.Component.getInitialProps) {
//     // calls the rendered page's `getInitialProps' if it has one
//     pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
//   }
//   appProps.pageProps = { ...appProps.pageProps, ...pageProps };

//   return { ...appProps, ...data };
// };
