import React from "react";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function AuthVerify(props) {
  React.useEffect(() => {
    const unlisten = props.history.listen((location, action) => {
      // ... logic
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (user) {
        const decodedJwt = parseJwt(user.accessToken);
        console.log(decodedJwt.exp);

        if (decodedJwt.exp * 1000 < Date.now()) {
          props.logout();
        }
      }
    });
  
    return unlisten;
  }, []);

  return (<div></div>);
}

export default AuthVerify;