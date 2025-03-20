import React, {CSSProperties, useEffect, useState} from 'react';
import {generateProblemOverview} from "../ai/profile-gen.ts";
import {retrievePersonaId, retrieveUserProfile, storeUserProblem} from "../user/user-store.ts";
import {useNavigate} from "react-router-dom";
import {SyncLoader} from "react-spinners";
import logo from "./../images/logo.png";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export function Generate() {

  const navigate = useNavigate();

  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#008334");

  useEffect(() => {
    const fetchData = async () => {
      const userResponses = retrieveUserProfile();
      const personaId = retrievePersonaId();
      const problem = await generateProblemOverview(userResponses, personaId);
      storeUserProblem(problem.details);
      navigate("/dashboard");
    };

    fetchData();
  }, []);

  return <div className="flex flex-col items-center justify-center h-screen text-center">
    <img src={logo} height={20} width={150} alt="Logo" className={"mb-20"} />
    <SyncLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={10}
        aria-label="Loading Spinner"
        data-testid="loader"
    />
  </div>
}

export default Generate;
