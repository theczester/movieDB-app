import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import MovieDetails from "./views/MovieDetails/MovieDetails";
import FavoritePage from "./views/FavoritePage/FavoritePage";
import ResultsPage from "./views/ResultsPage/ResultsPage";
import Profile from './views/Profile/Profile'

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          <Route exact path="/" render={() => <ResultsPage />} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route
            exact
            path="/movie/:movieId"
            component={Auth(MovieDetails, null)}
          />
          <Route exact path="/favorite" component={Auth(FavoritePage, true)} />
          <Route exact path="/search" render={() => <ResultsPage search />} />
          <Route exact path="/profile" component={Auth(Profile, true)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
