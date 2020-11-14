import React, { Component } from "react";

export default class Login extends Component {
    render() {
        return (

<div class="container">
  <form method="POST" action="/login"  >
      <h2>Log in </h2>

      <input name="email" type="text" class="form-control" placeholder="Email Address"
              autofocus="true"/>
      <input name="password" type="password" class="form-control" placeholder="Password"/>

      <button class="btn btn-lg btn-primary btn-block" type="submit">Log In</button>
          
      <div style="align-text:center;margin-bottom:10px;margin-top:15px"> Don't have an account? <a href='/register'>Sign up</a></div>
    
  </form>
</div>
);
}
}
