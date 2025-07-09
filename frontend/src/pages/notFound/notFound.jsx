import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./NotFound.css";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Emergency platform</title>
        <meta
          name="description"
          content="The page you're looking for cannot be found."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <main className="notfound-main">
        <div className="notfound-center">
          <h1 className="notfound-title">404</h1>
          <p className="notfound-message">Page not found</p>
          <div className="notfound-links">
            <p>Here are some helpful links:</p>
            <nav>
              <Link to="/" className="notfound-link">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
