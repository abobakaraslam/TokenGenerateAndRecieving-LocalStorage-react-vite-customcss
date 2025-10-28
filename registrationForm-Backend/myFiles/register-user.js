//File: register-user.js in ROOT-FOLDER/myFiles/ folder

import myExpress from "express"
const myRouter = myExpress.Router()
import myUser from "../myschema/UserSchema.js" //one folder back from "this" file
import sanitizeInput from "../utils/sanitizeInput.js"
import regEmailTest from "../utils/regEmailTest.js"
import isAlphabetOnly from "../utils/isAlphabetOnly.js"
import charLength from "../utils/charLength.js"
import jwt from "jsonwebtoken";

import { body, validationResult } from "express-validator"

// Secret key for signing tokens (keep this private in env.local file)
const JWT_SECRET = "mySuperSecretKey_12345"; // You can store in .env file

//sub-route is /register-user/
myRouter.post('/', [
    body("regEmail").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
    body("regName").notEmpty().withMessage("Name is required")
],
    async (req, res) => {
        const resData = {};

        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            resData.message = "Validation failed";
            resData.errors = errors.array();
            return res.json(resData);
        }
        try {
            //validating email
            let email_get = sanitizeInput(req.body.regEmail);
            if (regEmailTest(email_get) === 0) {
                resData.message = "Email is not valid";
                return res.json(resData);
            }

            //validating name
            let name_get = sanitizeInput(req.body.regName);
            if (isAlphabetOnly(name_get) === 0) {
                resData.message = "Name invalid: Only characters are allowed";
                return res.json(resData);
            } else if (charLength(name_get, 6, 35) === 0) {
                resData.message = "Name invalid: Number of characters should be from 6 to 35";
                return res.json(resData);
            }

            let password_get = sanitizeInput(req.body.password)

            let savingData = {
                regEmail: email_get,
                regName: name_get,
                password: password_get
            }

            //save/create/insert data into databas
            let myNewUser = await myUser.create(savingData)

            //define payload data that should be encoded into JWT
            let payload_data = {
                email: email_get,
                name: name_get,
                userType: "user"
            }

            // Generate token
            const token = jwt.sign(
                payload_data,
                JWT_SECRET,
                { expiresIn: "2m" } // token expires in 1 hour
                //you can specify time as 60s, 5m, 2d etc
            );

            if (myNewUser) {
                resData.resStatus = "true";
                resData.message = "Registered Successfully.";
                resData.insertedData = savingData;
                resData.token = token;//send token to frontend
            } else {
                resData.resStatus = "false";
                resData.message = "Error for Create/Insert Data";
            }
            return res.json(resData)

        } catch (e) {
            console.error("Error inserting user:", e);
        }
    })

//exporting so that it can access from other files

export default myRouter;
