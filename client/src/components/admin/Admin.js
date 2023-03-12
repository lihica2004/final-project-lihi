import axios from "axios";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import RequestAdmin from './RequestAdmin'
import classes from "./Admin.module.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import moment from 'moment';

const Admin = () => {
  let count = 0;
  const [limit, setLimit] = useState(3)
  const authCtx = useContext(AuthContext);
  const [usersRequests, setUsersRequests] = useState();
  const [showDate, setShowDate] = useState(false);
  const [sortDate, setSortDate] = useState(false);
  const [sortCategory, setSortCategory] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  

  async function getRequests(limit) {
    const response = await axios.get(`/requests/admin/?limit=${limit}`, {
      headers: { 'Authorization': "Bearer " + authCtx.token },
  });
    return response.data;
  }
  async function getAllRequests() {
    const response = await axios.get(`/requests/admin/all`, {
      headers: { 'Authorization': "Bearer " + authCtx.token },
  });
    return response.data;
  }

  useEffect(() => {
    const x = async () => {
      let usersReq;
      try {
        if (!sortDate && !sortCategory) {
           usersReq = await getRequests(limit);
        } else {
           usersReq = await getAllRequests();
        }
        setUsersRequests(usersReq);
        //   console.log(userRequests);
      } catch (e) {
        console.log(e.message);
      }
    };
    x();
  }, [sortDate, sortCategory]);

  const addMore = async () => {
    setLimit(+limit + 3)
    const usersReq = await getRequests(limit);
    setUsersRequests(usersReq);
  }

  const filterByDate = () => {
    setShowDate(!showDate)
  }

  const sortByDate = (createdDate) => {
    const startDate = date[0].startDate;
    const endDate = date[0].endDate;
    if (moment(createdDate).isBefore(endDate) && moment(createdDate).isAfter(startDate)) {
      console.log(true)
      return true;
    }
    console.log(false)
    count++;
    return false;
  }

  const sortByDateHandler = () => {
    setSortDate(true)
    setShowDate(false)
  }

  const filterByDefault = () => {
    window.location.reload(true);
    setShowCategory(false)
  }

  const filterByCategory = () => {
    setShowCategory(!showCategory)
  }

  const filterByCategoryHandler = (event) => {
    setCategory(event.target.id)
    console.log(event.target.id)
    setSortCategory(true)
  }

  return (
    
    <div>
      {showDate && <div>
        <div className={classes.date}>
        <DateRange
          editableDateInputs={true}
          onChange={item => setDate([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={date}
        />
      </div>
      <button onClick={sortByDateHandler} className={classes.dateBtn}>סינון</button>
      </div>}
      <div className={classes.allContainer}>
        {usersRequests === undefined ||
          (usersRequests.length === 0 && (
            <h1 className={classes.header}>אופס! עדיין לא הוגשו בקשות</h1>
            ))}
        {!(usersRequests === undefined || usersRequests.length === 0) && (
          <h1 className={classes.header}>היסטוריית בקשות: </h1>
          )}
          <div className={classes.btnContainer}>
            <button onClick={filterByDate}>סינון לפי תאריך</button>
            <button onClick={filterByCategory}>סינון לפי קטגוריה</button>
            <button onClick={filterByDefault}>ברירת מחדל</button>
          </div>
          {showCategory && <ul type="none" className={classes.dropdownCategory}>
              <li onClick={filterByCategoryHandler} id="בקשת השחרה"> בקשת השחרה</li>
              <li onClick={filterByCategoryHandler} id="בקשת אישור כניסה רגלי/ רכוב לבה''ד">בקשת אישור כניסה רגלי/ רכוב לבה"ד</li>
              <li onClick={filterByCategoryHandler} id="בקשת קידוד חוגר">בקשת קידוד חוגר</li>
              <li onClick={filterByCategoryHandler} id="בקשת טופס חתימה על שו''ס">בקשת טופס חתימה על שו"ס</li>
            </ul>}
          {!sortDate && !sortCategory && <ul type="none">
            {usersRequests?.map((request) => (
              <RequestAdmin request={request} />
            ))}
          </ul>}
        {sortDate && <ul type="none">
          {usersRequests?.map((request) => (sortByDate(request.createdAt)) && <RequestAdmin request={request} /> )}
        </ul>}
        {sortCategory && <ul type="none">
          {usersRequests?.map((request) => (request.name === category.toString()) &&  <RequestAdmin request={request}/>)}
        </ul>}
        {(count === usersRequests?.length && sortDate) && <h1 className={classes.notFound}>לא נמצאו בקשות בטווח התאריכים שהוכנס.</h1>}
        {!sortDate && !sortCategory && <button className={classes.loadMore} onClick={addMore}>טען עוד</button>}
      </div>
    </div>
  );
};

export default Admin;
