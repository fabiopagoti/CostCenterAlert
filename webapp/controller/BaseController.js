sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("festo.co.costcenteralert.controller.BaseController", {

		_filters: {
			resultsBy: [{
				key: "year",
				text: "Year"
			}, {
				key: "quarter",
				text: "Quarter"
			}, {
				key: "month",
				text: "Month"
			}],
			years: [{
				key: "2017",
				text: "2017"
			}, {
				key: "2016",
				text: "2016"
			}, {
				key: "2015",
				text: "2015"
			}],
			quarters: [{
				key: "Q1",
				text: "Q1"
			}, {
				key: "Q2",
				text: "Q2"
			}, {
				key: "Q3",
				text: "Q3"
			}, {
				key: "Q4",
				text: "Q4"
			}],
			months: [{
				key: 1,
				text: "January"
			}, {
				key: 2,
				text: "February"
			}, {
				key: 3,
				text: "March"
			}, {
				key: 4,
				text: "April"
			}, {
				key: 5,
				text: "May"
			}, {
				key: 6,
				text: "June"
			}, {
				key: 7,
				text: "July"
			}, {
				key: 8,
				text: "August"
			}, {
				key: 9,
				text: "September"
			}, {
				key: 10,
				text: "October"
			}, {
				key: 11,
				text: "November"
			}, {
				key: 12,
				text: "December"
			}]
		},

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Set slider handle's colors based on RangeSlider values
		 * @param {object} oSlider Range Slider
		 * @public
		 */
		setRangeSliderColors: function(oSlider) {
			var oSliderDom = $("#" + oSlider.getId());

			var aHandlers = oSliderDom.find(".sapMSliderHandle");

			var oLeftHandle = $(aHandlers[0]);
			var oRightHandle = $(aHandlers[1]);

			function getColor(iValue) {
				if (iValue >= 100) {
					return "bad";
				} else if (iValue > 50) {
					return "warning";
				} else {
					return "good";
				}
			}

			function getColorFromTheme(iValue) {
				var oThemeParameters = sap.ui.core.theming.Parameters;
				if (iValue >= 100) {
					return oThemeParameters.get("sapErrorBorderColor");
				} else if (iValue > 50) {
					return oThemeParameters.get("sapWarningBorderColor");
				} else {
					return oThemeParameters.get("sapSuccessBorderColor");
				}
			}

			if (sap.ui.core.theming.Parameters.get("sapSuccessBorderColor")) {
				oLeftHandle.css("background-color", getColorFromTheme(oSlider.getValue()));
				oRightHandle.css("background-color", getColorFromTheme(oSlider.getValue2()));
			} else {
				aHandlers.removeClass("good warning bad");
				oLeftHandle.addClass(getColor(oSlider.getValue()));
				oRightHandle.addClass(getColor(oSlider.getValue2()));
			}

		},

		/**
		 * Unset slider handle's colors based on RangeSlider values
		 * @param {object} oSlider Range Slider
		 * @public
		 */
		unsetRangeSliderColors: function(oSlider) {
			var oSliderDom = $("#" + oSlider.getId());

			var aHandlers = oSliderDom.find(".sapMSliderHandle");

			var oLeftHandle = $(aHandlers[0]);
			var oRightHandle = $(aHandlers[1]);

			if (sap.ui.core.theming.Parameters.get("sapSuccessBorderColor")) {
				oLeftHandle.css("background-color", "unset");
				oRightHandle.css("background-color", "unset");
			} else {
				aHandlers.removeClass("good warning bad");
			}

		}

	});

});