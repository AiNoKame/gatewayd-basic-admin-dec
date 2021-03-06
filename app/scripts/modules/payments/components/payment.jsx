"use strict";

var React = require('react');
var moment = require('moment');

var ModalTrigger = require('react-bootstrap').ModalTrigger;
var ModalPaymentDetails = require('./payment-detail.jsx');

var Payment = React.createClass({
  handleLinkClick: function(e) {
    e.stopPropagation();
  },

  handleItemClick: function(id) {
    this.props.itemClickHandler(id);
  },

  handleDoneButtonClick: function(id, e) {
    e.stopPropagation();

    this.props.doneButtonClickHandler(id);
  },

  handleRetryButtonClick: function(id, e) {
    e.stopPropagation();

    this.props.retryButtonClickHandler(id);
  },

  showSpinningIcon: function() {
    this.setState({
      refreshIconClasses: 'glyphicon glyphicon-refresh glyphicon-spin'
    });
  },

  hideSpinningIcon: function() {
    this.setState({
      refreshIconClasses: ''
    });
  },

  getInitialState: function() {
    return {
      refreshIconClasses: ''
    };
  },

  componentDidMount: function() {
    this.props.model.on('retryStart', this.showSpinningIcon);
    this.props.model.on('retryStop', this.hideSpinningIcon);
  },

  componentWillUnmount: function() {
    this.props.model.off('retryStart');
    this.props.model.off('retryStop');
  },

  render: function() {
    var doneButton, retryLink, refreshIcon, address;
    var paymentItemClasses = '';
    var rippleGraphLink = 'http://www.ripplecharts.com/#/graph/' + this.props.model.get('transaction_hash');

    if (this.props.model.get('new')) {
      paymentItemClasses += ' highlight';
    }

    if (this.props.model.get('direction') === 'from-ripple') {
      address = ['From', this.props.model.get('fromAddress').address];
    } else {
      address = ['To', this.props.model.get('toAddress').address];
    }


    //make a done button component and put this logic there!!
    if (this.props.model.get('state') === 'incoming') {
      doneButton = (
        <button
          onClick={this.handleDoneButtonClick.bind(this, this.props.model.get('id'))}
          className="btn pull-right"
        >
          Process
        </button>
      );
    } else {
      doneButton = null;
    }

    if (this.props.model.get('state') === 'failed') {
      retryLink=(
        <a onClick={this.handleRetryButtonClick.bind(this,this.props.model.get('id'))}>
          Retry?
        </a>
      );
    } else {
      retryLink = null;
    }

    return (
      <div className={paymentItemClasses}>
        <ModalTrigger modal={<ModalPaymentDetails model={this.props.model} />}>
          <li className="list-group-item" onClick={this.handleItemClick.bind(this, this.props.model.get('id'))}>
            <div className="row">
              <div className="col-sm-4">
                To Currency: {this.props.model.get('to_currency')} {this.props.model.get('to_amount')}
              </div>
              <div className="col-sm-1">
              </div>
              <div className="col-sm-4">
                From Currency: {this.props.model.get('from_currency')} {this.props.model.get('from_amount')}
              </div>
              <div className="col-sm-3">
                Status: {this.props.model.get('state')} {retryLink} <span className={this.state.refreshIconClasses} />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                Destination Tag: {this.props.model.get('toAddress').tag}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-8">
                {address[0]} Address: {address[1]}
              </div>
              <div className="col-sm-4">
                {doneButton}
              </div>
            </div>
            <div className="row border-bottom">
              <div className="col-sm-12">
                <a href={rippleGraphLink} onClick={this.handleLinkClick}>Ripple Graph Link</a>
              </div>
            </div>
            <div className="clearfix">
              <span className="pull-left">
                {moment(this.props.model.get('createdAt')).format('MMM D, YYYY HH:mm z')}
              </span>
            </div>
          </li>
        </ModalTrigger>
      </div>
    );
  }
});

module.exports = Payment;
