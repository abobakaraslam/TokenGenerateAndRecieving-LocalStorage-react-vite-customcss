/*File: Register.jsx located in RootFolder/src/      */

import { useState } from "react";
import { sanitizeInput } from "../utils/sanitizeInput";
import { isAlphabetOnly } from "../utils/isAlphabetOnly";
import { charLength } from "../utils/charLength";
import { regEmailTest } from "../utils/regEmailTest";

function Register() {
  //States for errors
  const [errorOverallState, setErrorOverallState] = useState("");
  const [errornameFieldState, setErrornameFieldState] = useState("");
  const [errorEmailState, setErrorEmailState] = useState("");
  const [errorPassState, setErrorPassState] = useState("");

  //initialize states for all input fields
  const [InputData, setInputData] = useState({
    nameField: "",
    emailField: "",
    passField: "",
    rePassField: ""
  });
  //function to update values of states when user types
  const onChangeInputData = (event) => {
    setInputData({ ...InputData, [event.target.name]: event.target.value });
  };


  //sending data from frontend to database
  const savingData = async(regEmail, regName, password)=>{
    const myEndpoint = "http://localhost:5000/user/register-user/";
    try {
      const response = await fetch(myEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          regName: regName,
          regEmail: regEmail,
          password: password
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const resJSON_Data = await response.json();
      
      if(resJSON_Data.resStatus === "true"){
        alert("Register successfully, now page will be moved to Dashboard Page");
        //console.log("data inserted successfully");
        //console.log("resJSON_Data: ", resJSON_Data);
        localStorage.setItem("userToken", resJSON_Data.token);
        window.location.replace("/dashboard/");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  //When form is submitted
  const handleForm = (event)=>{
    event.preventDefault(); //avoid page loading when form is submitted

    // Reset previous errors
    setErrorOverallState("");
    setErrornameFieldState("");
    setErrorEmailState("");
    setErrorPassState("");

    let errorOverall = 1; // assume no errors initially
    
    //Validating nameField
    let nameField_get = sanitizeInput(InputData.nameField);//sanitization
    if (nameField_get === "") {
      setErrornameFieldState("Please enter in textField1");
      errorOverall = 0;
    }else if(isAlphabetOnly(nameField_get) === 0){
      setErrornameFieldState("Only characters are allowed, here");
      errorOverall = 0;
    }else if (charLength(nameField_get, 6, 35) === 0) {
      setErrornameFieldState("character should be within 6 to 35");
      errorOverall = 0;
    }

    //Validating emailField
    let emailField_get = sanitizeInput(InputData.emailField);//sanitization
    if (emailField_get === "") {
      setErrorEmailState("Please enter email");
      errorOverall = 0;
    }else if(regEmailTest(emailField_get) === 0){
      setErrorEmailState("Invalid Email format");
      errorOverall = 0;
    }

    //Validating passField
    let passField_get = sanitizeInput(InputData.passField);//sanitization
    if (passField_get === "") {
      setErrorPassState("Please enter password");
      errorOverall = 0;
    }else if (charLength(passField_get, 6, 35) === 0) {
      setErrorPassState("character should be within 6 to 35");
      errorOverall = 0;
    }

    //Validating Repeat-passField
    let rePassField_get = sanitizeInput(InputData.rePassField);//sanitization
    if (passField_get !== rePassField_get) {
      setErrorPassState("Both Passwords are not matched");
      errorOverall = 0;
    }

    //Stop execution if errors exist
    if (errorOverall === 0) {
      setErrorOverallState("Please enter all data in correct format");
      return;// stops the function here
    }
    console.log("nameField_get: ",nameField_get);
    console.log("emailField_get: ",emailField_get);
    console.log("passField_get: ",passField_get);
    console.log("rePassField_get1: ",rePassField_get);

    savingData(emailField_get, nameField_get, passField_get);
  }
  
  return <div>
    {errorOverallState && (
      <p style={{color: "red"}}>{errorOverallState}</p>
    )}
    <h1>Register</h1>
    <form onSubmit={handleForm}>

      <label htmlFor="name">Name</label><br />
      {errornameFieldState && (
        <p style={{color: "red"}}>{errornameFieldState}</p>
      )}
      <input type="text" name="nameField" id="nameField" value={InputData.regEmail} onChange={onChangeInputData} placeholder="M Abo Bakar" />
      <br />

      <label htmlFor="email">Email</label><br />
      {errorEmailState && (
        <p style={{color: "red"}}>{errorEmailState}</p>
      )}
      <input type="email" name="emailField" id="emailField" value={InputData.emailField} onChange={onChangeInputData} placeholder="abobakar@gmail.com" />
      <br />

      <label htmlFor="password">Password</label><br />
      {errorPassState && (
        <p style={{color: "red"}}>{errorPassState}</p>
      )}
      <input type="password" name="passField" id="passField" value={InputData.passField} onChange={onChangeInputData} placeholder="" />
      <br />

      <label htmlFor="rePassword">Repeat Password</label><br />
      <input type="password" name="rePassField" id="rePassField" value={InputData.rePassField} onChange={onChangeInputData} placeholder="" />
      <br />

      <button type="submit">Submit</button>
    </form>
  </div>
}
export default Register;