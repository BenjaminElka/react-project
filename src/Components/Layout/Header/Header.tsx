/*  src/Components/Layout/Header/Header.tsx  */

import { Navbar, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { userActions } from "../../../store/userSlice";
import { searchActions } from "../../../store/searchSlice";
import { TRootState } from "../../../store/store";

/* the JWT fields we care about */
type TokenPayload = {
  _id: string;
  isBusiness: boolean;
  exp: number;           // epoch-seconds
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s: TRootState) => s.userSlice.user);

  /* ──────────────────────────────────────────
     ①  Bootstrap from token (and guard expiry)
  ────────────────────────────────────────── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(userActions.logout());
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const now = Date.now() / 1000;

      /* expired? → wipe & bail out */
      if (decoded.exp < now) {
        localStorage.removeItem("token");
        dispatch(userActions.logout());
        return;
      }

      /* logged-in already? nothing to do */
      if (user) return;

      /* fetch fresh user profile into Redux */
      axios
        .get(
          `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${decoded._id}`,
          { headers: { "x-auth-token": token } },
        )
        .then((res) => dispatch(userActions.login(res.data)))
        .catch(() => {
          localStorage.removeItem("token");
          dispatch(userActions.logout());
        });
    } catch {
      localStorage.removeItem("token");
      dispatch(userActions.logout());
    }
  }, [dispatch, user]);

  /* ──────────────────────────────────────────
     ②  Sign-out handler
  ────────────────────────────────────────── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(userActions.logout());
    navigate("/");
  };

  /* ──────────────────────────────────────────
     ③  Render
  ────────────────────────────────────────── */
  return (
    <Navbar fluid rounded className="bg-slate-800">
      {/* brand / logo */}
      <Navbar.Brand as={Link} to="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          My&nbsp;App
        </span>
      </Navbar.Brand>

      {/* search box */}
      <div className="hidden sm:block">
        <TextInput
          rightIcon={IoSearchSharp}
          onChange={(e) =>
            dispatch(searchActions.setSearchWord(e.target.value))
          }
        />
      </div>

      <Navbar.Toggle />

      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/" className="text-white">
          Home
        </Navbar.Link>

        {/*  unauthenticated links  */}
        {!user && (
          <>
            <Navbar.Link as={Link} to="/signin" className="text-white">
              Sign&nbsp;In
            </Navbar.Link>
            <Navbar.Link as={Link} to="/signup" className="text-white">
              Sign&nbsp;Up
            </Navbar.Link>
          </>
        )}

        {/*  authenticated links  */}
        {user && (
          <>
            <Navbar.Link
              className="cursor-pointer text-white"
              onClick={handleLogout}
            >
              Sign&nbsp;Out
            </Navbar.Link>

            <Navbar.Link as={Link} to="/profile" className="text-white">
              Profile
            </Navbar.Link>

            <Navbar.Link as={Link} to="/favourites" className="text-white">
              Favourites
            </Navbar.Link>

            {user.isBusiness && (
              <Navbar.Link
                as={Link}
                to="/create-card"
                className="text-white"
              >
                Create&nbsp;Card
              </Navbar.Link>
            )}
          </>
        )}

        {/* always available */}
        <Navbar.Link as={Link} to="/about" className="text-white">
          About
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
