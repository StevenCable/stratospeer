import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateUsr, updatePswd, updateErr, updateCurr, updateView } from '../actions';

class LoginContainer extends Component {

	handleUsr = e => this.props.onUpdateUsr(e.target.value);

	handlePswd = e => this.props.onUpdatePswd(e.target.value);

	submit = e => {
		e.preventDefault();
		const {usr, pswd} = this.props.loginForm;
		const xhr = new XMLHttpRequest();
		xhr.addEventListener('load', e => {
			let {success, error, currentUser} = JSON.parse(xhr.responseText);
			this.props.onUpdateErr(error);
			if(success) {
				this.props.onUpdateCurr(currentUser);
				this.props.history.push('/', null);
			}
		});
		xhr.open('POST', `${this.props.url}/user/login`, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify((usr.indexOf('@') > -1) ?
			({email: usr, password: pswd}) : ({username: usr, password: pswd})));
	}

  componentWillMount() {
    this.props.onUpdateView(this.props.location.pathname);
  }

	render() {
		return (
			<div id="login">
				<h1>Login</h1>
				<form action={`${this.props.url}/user/login`} method="post" onSubmit={this.submit}>
					<div className="error" style={this.props.loginForm.error ?
						({}) : ({display: "none"})}>
						{this.props.loginForm.error}
					</div>
					<div>
						<label>username</label>
						<input type="text" name="username" onChange={this.handleUsr} />
					</div>
					<div>
						<label>password</label>
						<input type="password" name="password" onChange={this.handlePswd} />
					</div>
					<div>
						<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		loginForm: state.users.loginForm,
    currentView: state.views.currentView,
    url: state.data.url
	}
}

function mapDispatchToProps(dispatch) {
	return {
		onUpdateUsr: usr => dispatch(updateUsr(usr)),
		onUpdatePswd: pswd => dispatch(updatePswd(pswd)),
		onUpdateErr: err => dispatch(updateErr(err)),
		onUpdateCurr: curr => dispatch(updateCurr(curr)),
    onUpdateView: view => dispatch(updateView(view))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginContainer);