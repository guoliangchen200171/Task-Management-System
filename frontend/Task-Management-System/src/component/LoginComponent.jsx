import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { loginApi, saveLoggedUser, storeBasicAuth } from "../service/AuthApiService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/tasks.css";

function getLoginErrorMessage(error) {
  if (error?.response?.status === 401) {
    return "Invalid username or password";
  }
  if (!error?.response) {
    return "Cannot reach server. Check that the backend is running and you are using http://localhost:3000";
  }
  return error.response?.data?.message || "Login failed";
}

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  async function handleLoginForm(event) {
    event.preventDefault();
    // #region agent log
    fetch('http://127.0.0.1:7372/ingest/6afc323c-cc4e-49d5-ac76-c5812cce471f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c6bb02'},body:JSON.stringify({sessionId:'c6bb02',location:'LoginComponent.jsx:handleLoginForm',message:'submit',data:{hasUsername:!!username.trim(),hasPassword:!!password.trim()},timestamp:Date.now(),hypothesisId:'H-A',runId:'pre-fix'})}).catch(()=>{});
    // #endregion

    const formValid = validateForm();
    // #region agent log
    fetch('http://127.0.0.1:7372/ingest/6afc323c-cc4e-49d5-ac76-c5812cce471f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c6bb02'},body:JSON.stringify({sessionId:'c6bb02',location:'LoginComponent.jsx:validateForm',message:'validation result',data:{formValid},timestamp:Date.now(),hypothesisId:'H-A',runId:'pre-fix'})}).catch(()=>{});
    // #endregion

    if (formValid) {
      await loginApi(username, password)
        .then((response) => {
          console.log(response.data);
          // #region agent log
          fetch('http://127.0.0.1:7372/ingest/6afc323c-cc4e-49d5-ac76-c5812cce471f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c6bb02'},body:JSON.stringify({sessionId:'c6bb02',location:'LoginComponent.jsx:then',message:'login success handler',data:{status:response.status,hasId:response.data?.id!=null,hasRole:response.data?.role!=null,keys:response.data?Object.keys(response.data):[]},timestamp:Date.now(),hypothesisId:'H-D',runId:'pre-fix'})}).catch(()=>{});
          // #endregion
          const basicAuth = "Basic " + btoa(username + ":" + password);
          const role = response.data.role;
          storeBasicAuth(basicAuth);
          saveLoggedUser(response.data.id, username, role);
          navigate(`/tasks`);
        })
        .catch((error) => {
          console.error(error);
          // #region agent log
          fetch('http://127.0.0.1:7372/ingest/6afc323c-cc4e-49d5-ac76-c5812cce471f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c6bb02'},body:JSON.stringify({sessionId:'c6bb02',location:'LoginComponent.jsx:catch',message:'login failed',data:{message:error?.message,status:error?.response?.status,code:error?.code,hasResponse:!!error?.response},timestamp:Date.now(),hypothesisId:'H-B,H-C',runId:'pre-fix'})}).catch(()=>{});
          // #endregion
        });
    }
  }

  function validateForm() {
    let valid = true;

    const errorsCopy = { ...errors };

    if (!username.trim()) {
      errorsCopy.username = "Username required";
      valid = false;
    } else {
      errorsCopy.username = "";
    }

    if (!password.trim()) {
      errorsCopy.password = "Password required";
      valid = false;
    } else {
      errorsCopy.password = "";
    }
    setErrors(errorsCopy);

    return valid;
  }

  return (
    <div className="login-page">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center">
            <img src="/src/assets/loginPage.jpg" alt="Login Page" className="img-fluid" />
          </Col>
          <Col md={6}>
            <div className="login-form bg-light shadow-lg p-4">
              <h2 className="mb-4 text-center">Login</h2>
              <form onSubmit={handleLoginForm}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="username"
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-dark btn-block">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginComponent;
