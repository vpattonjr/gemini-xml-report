'use strict';

var inherit = require('inherit'),
    _ = require('lodash'),
	fs = require('fs'),
	moment = require('moment'),
	collection = {},
	builder = require('junit-report-builder'),
    RunnerEvents = require('../gemini/lib/constants/events');

var Runner = inherit({
    attachRunner: function(runner) {
        runner.on(RunnerEvents.BEGIN, this._onBegin.bind(this));
        runner.on(RunnerEvents.END_TEST, this._onEndTest.bind(this));
        runner.on(RunnerEvents.CAPTURE, this._onCapture.bind(this));
        runner.on(RunnerEvents.ERROR, this._onError.bind(this));
        runner.on(RunnerEvents.WARNING, this._onWarning.bind(this));
        runner.on(RunnerEvents.END, this._onEnd.bind(this));
        runner.on(RunnerEvents.INFO, this._onInfo.bind(this));
        runner.on(RunnerEvents.SKIP_STATE, this._onSkipState.bind(this));
        runner.on(RunnerEvents.TEST_RESULT, this._onTestResult.bind(this));
    },

    _onBegin: function() {
		this.beginTestTime = this.startTime = new Date();
		this.suiteSet = {};
		this.results = {
			stats:{},
			passes:[],
			failures:[],
			skipped:[]
		};
    },

    _onEndTest: function(result) {
        var handler = result.equal? this._onCapture : this._onError;
        collection.handler = handler;
        handler.call(this, result);
    },

    _onCapture: function(result) {
		var pass = this._createResult(result);
		this.results.passes.push(pass);
    },

    _onError: function(result) {
		var error = this._createResult(result);
		error.error = result.message;
		this.results.failures.push(error);
    },

    _onWarning: function(result) {
		var warn = this._createResult(result);
		warn.warning = result.message;
		this.results.skipped.push(warn);
    },

    _onSkipState: function(result) {
		var warn = this._createResult(result);
		warn.warning = result.message;
		this.results.skipped.push(warn);
    },

    _onInfo: function(result) {
        console.log(result.message);
    },

    _onTestResult: function(result) {
    	collection.result = this._createResult(result)
    },

    _onEnd: function(result) {
//        var total = this.results.failures.length + this.results.passes.length + this.results.skipped.length;
		var endTime = new Date();
//		var suites = 0;
		// for(var k in this.suiteSet){
		// 	suites++;
		// }
//		var now = new Date()
		var d = Math.round((endTime - this.startTime) / 1000)
		var testDuration = moment().add(moment.duration(d)).format('ss')
		var suite = builder.testSuite().name('Gemini-Report').time(d).timestamp(this.beginTestTime);
		var testCase = _.forEach(this.results.passes, function (data) {
			suite.testCase(data.fullTitle)
  			.className(data.browserID.replace(/ /g,'')+'.Class')
  			.name(data.title)
  			.time(data.duration)
		});
		var testCase = _.forEach(this.results.failures, function (data) {
			suite.testCase(data.fullTitle)
  			.className(data.browserID.replace(/ /g,'')+'.Class')
  			.name(data.title)
  			.time(data.duration)
  			.failure(data.error)
  			.error(data.referencePath)
		});
		var testCase = _.forEach(this.results.skipped, function (data) {
			suite.testCase(data.fullTitle)
  			.className(data.browserID.replace(/ /g,'')+'.Class')
  			.name(data.title)
  			.time(data.duration)
  			.skipped()
		});
   		builder.writeTo('reports/gemini-xml-report.xml');
    },

	_createResult: function(result){
		var obj = {};
		obj.title = result.state ? result.state.name : "unknown";
		obj.fullTitle = result.suite.path.join(' ');
		obj.browserID = result.browserId;
		obj.duration = this._getDuration();
		obj.referencePath = result.referencePath;
		obj.url = result.suite.url;
		this.suiteSet[result.suite.name] = true;
		return obj;
	},
	
	_getDuration: function(){
		var now = new Date();
		var duration = Math.round((now - this.beginTestTime) / 1000);
		this.beginTestTime = now;
		return duration;
	}

});

module.exports = function(gemini, options){
	var runner = new Runner();
    gemini.on('startRunner', runner.attachRunner.bind(runner));
};
