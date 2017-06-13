/*global location*/
sap.ui.define([
	"festo/co/costcenteralert/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"festo/co/costcenteralert/model/formatter"
], function(
	BaseController,
	JSONModel,
	History,
	formatter
) {
	"use strict";

	return BaseController.extend("festo.co.costcenteralert.controller.S2", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("cost-center-group").attachPatternMatched(this._onCostCenterGroupMatched, this);
			this.getRouter().getRoute("cost-center").attachPatternMatched(this._onCostCenterMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
			
			this._createFilterModel();
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_createFilterModel: function(oEvent) {
			var oFilterModel = new JSONModel(this._filters);
			this.setModel(oFilterModel, "filters");
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onCostCenterGroupMatched: function(oEvent) {
			var oArguments = oEvent.getParameter("arguments");
			var sCostCenterGroup = oArguments.costCenterGroup;
			this._sCostCenterGroup = sCostCenterGroup;
			this.getModel().metadataLoaded().then(function() {
				this._bindView("/CostCenterUnits('1')");
				this._bindView("/CostCenterUnits('" + this._sCostCenterGroup + "')");
			}.bind(this));
		},

		_onCostCenterMatched: function(oEvent) {
			var oArguments = oEvent.getParameter("arguments");
			var sCostCenterGroup = oArguments.costCenterGroup;
			var sCostCenter = oArguments.costCenter;
			this._sCostCenter = sCostCenter;
			this.getModel().metadataLoaded().then(function() {
				this._bindView("/CostCenterUnits('" + this._sCostCenter + "')");
			}.bind(this));
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();
			
			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					expand: "ToCostElementGroups"
				},
				events: {
					// change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			return;
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			// var oResourceBundle = this.getResourceBundle(),
			// 	oObject = oView.getBindingContext().getObject(),
			// 	sObjectId = oObject.Id,
			// 	sObjectName = oObject.Name;

			// Everything went fine.
			oViewModel.setProperty("/busy", false);
		}

	});

});