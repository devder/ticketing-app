import "bootstrap/dist/css/bootstrap.css";
// import App from "next/app";
import buildClient from "api/build-client";
import Header from "components/header";

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.

MyApp.getInitialProps = async appContext => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  // const appProps = await App.getInitialProps(appContext);
  const { data } = await buildClient(appContext.ctx).get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    // calls the page's `getInitialProps' if it has one
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return { pageProps, ...data };
};
