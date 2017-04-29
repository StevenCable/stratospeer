import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateView} from '../../actions';
import './index.css';


class HomeContainer extends Component {

  componentWillMount() {
    this.props.onUpdateView(this.props.location.pathname)
  }

  render() {
		return (
			<div className="home-container">
        You haven't added any files yet
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
    currentUser: state.users.currentUser,
    currentView: state.views.currentView
	}
}

function mapDispatchToProps(dispatch) {
	return {
    onUpdateView: view => dispatch(updateView(view))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeContainer);
