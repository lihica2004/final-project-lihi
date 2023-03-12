import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../../store/auth-context";
import Request from "./Request";
import classes from './AdminOpen.module.css'



const AdminOpen = () => {
    const authCtx = useContext(AuthContext);
    const [usersRequests, setUsersRequests] = useState();

  async function getRequests() {
    try {

      const response = await axios.get(`/requests/admin`, {
        headers: { 'Authorization': "Bearer " + authCtx.token },
      });
      setUsersRequests(response.data);
      // return response.data;
    }  catch (e) {
      console.log(e.message);
    }
  }


  useEffect(() => {
     getRequests();
  }, []);

  

    return (
        <div className={classes.allContainer}>
      {!(usersRequests === undefined || usersRequests.length === 0) && <h1 className={classes.header}>בקשות שממתינות לאישור:</h1>}
      {usersRequests === undefined || usersRequests.length === 0 && <h1 className={classes.header}>אין בקשות שממתינות לאישור</h1>}
      <ul type="none">
        {usersRequests?.map((request) => (request.status === 'הבקשה פתוחה') && <Request request={request}/>)}
        </ul>
    </div>)
}

export default AdminOpen;