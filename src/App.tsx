import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Header from "./Components/Layout/Header/Header";
import Footer from "./Components/Layout/Footer/Footer";
import SignIn from "./Pages/SignIn/SignIn";
import Profile from "./Pages/Profile/Profile";
import RouteGuard from "./Components/RouteGuard";
import CreateCard from "./Pages/CreateCard/CreateCard";
import CardDetails from "./Components/CardDetails";
import Favourites from "./Pages/Favourites/Favourites";

import SignUp from "./Pages/SignUp/signUp";
import About from "./Pages/About/about";

function App() {
  //const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  return (
    <>
      {/* <Header isLoggedIn={isLoggedIn} setIsloggedIN={setIsLoggedIn} /> */}
      <Header />
      <Routes>
        <Route path="/*" element={<Home />} />
        {/* <Route
          path="/signin"
          element={<SignIn setIsloggedIN={setIsLoggedIn} />}
        /> */}
        <Route path="/signin" element={<SignIn />} />

        <Route path="/signUp" element={<SignUp />} />

        <Route path="/about" element={<About />} />

        <Route path="/card/:id" element={<CardDetails />} />

        <Route
          path="/profile"
          element={
            <RouteGuard>
              <Profile />
            </RouteGuard>
          }
        />

        <Route
          path="/favourites"
          element={
            <RouteGuard>
              <Favourites />
            </RouteGuard>
          }
        />

        <Route
          path="/create-card"
          element={
            <RouteGuard isBiz={true}>
              <CreateCard />
            </RouteGuard>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;