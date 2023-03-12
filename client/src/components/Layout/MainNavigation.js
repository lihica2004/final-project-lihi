import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const authCtx = useContext(AuthContext)
  const isLoggedIn = authCtx.isLoggedIn

  const logoutHandler = () => {
    authCtx.logout()
  }

  return (
    <header className={classes.header}>
        <div className={classes.logo}>מדור ביטחון מידע</div>
      <nav>
        <ul className={classes['main-navigation']}>
        {localStorage.getItem('isAdmin') === 'true' && <li>
            <Link to="/admin"><button>כל הבקשות</button></Link>
          </li>}
        {localStorage.getItem('isAdmin') === 'true' && <li>
            <Link to="/admin/open"><button className={classes.openBtn}>בקשות ממתינות לאישור</button></Link>
          </li>}
          {isLoggedIn &&
          <li>
            <div className={classes.dropdownOpen}  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >בקשה חדשה /\</div>
            {isDropdownOpen && <ul className={classes.dropdown} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Link to="/req/req1"><li name="בקשת השחרה"> בקשת השחרה</li></Link>
              <Link to="/req/req2"><li>בקשת אישור כניסה רגלי/ רכוב לבה"ד</li></Link>
              <Link to="/req/req3"><li>בקשת קידוד חוגר</li></Link>
              <Link to="/req/req4"><li>בקשת טופס חתימה על שו"ס</li></Link>
            </ul>}
          </li> }
          {isLoggedIn && <li>
            <Link to='/me'>האיזור האישי</Link>
          </li> }
          {isLoggedIn && <li>
            <button onClick={logoutHandler}>התנתקות</button>
          </li>}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;