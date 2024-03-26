import React, { useState, useEffect } from "react";

import { Redirect } from "react-router-dom";
import UserRoles from "../infrastructure/session/UserRoles";
import useUserSession from "../infrastructure/session/useUserSession";
import OneSignal from "react-onesignal";

//import OneSignal from 'react-onesignal';

const AuthorizedPage = () => {

    const [isAuthorized, setIsAuthorized]   = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const userSession = useUserSession();

    useEffect(() => {
        if (userSession) {
            var isAuth = userCanAccessToWebApp();
            setIsAuthorized(isAuth);
            if(!isInitialized){
                OneSignal.init({ appId: '7e2f4f83-bc0d-4d67-b637-8c71040c2914',  notificationClickHandlerMatch: "URL",
                allowLocalhostAsSecureOrigin: true}).then(() => {
                      OneSignal.login(userSession.userId);
                      setIsInitialized(true);
                });
            }

            function eventListener(event) {
            //   console.log(JSON.parse(JSON.stringify(event)));
               var url=event.result.url;
               
               const timeout = setTimeout(() => {
                // 👇️ redirects to an external URL
                window.location.replace(url);
              }, 1500);

            }
            OneSignal.Notifications.addEventListener("click", eventListener);
        }
    }, [userSession]);

    var userCanAccessToWebApp = function () {
        const roles = userSession.roles;
        return roles.includes(UserRoles.MedicalProfessional)
            || roles.includes(UserRoles.MedicalTeamAdmin)
            || roles.includes(UserRoles.Researcher)
            || roles.includes(UserRoles.Patient)
            || roles.includes(UserRoles.Nurse);
    }

    return (
        <div>
            {isAuthorized ?
                ""
                :
               <Redirect to="/unauthorized"/>
            }
        </div>
    );
};

export default AuthorizedPage;