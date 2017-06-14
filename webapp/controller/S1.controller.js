sap.ui.define([
	"festo/co/costcenteralert/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"festo/co/costcenteralert/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("festo.co.costcenteralert.controller.S1", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("treeTable");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			//iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._oTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0,
				showFooter: false
			});
			this.setModel(oViewModel, "view");

			this._createFilterModel();

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			/*oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", false);
			});
			*/
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		onRowSelectionChange: function(oEvent) {
			var oViewModel = this.getModel("view");
			var oSource = oEvent.getSource();
			var oParameters = oEvent.getParameters();

			if (oSource.getSelectedIndex() >= 0) {
				oViewModel.setProperty("/showFooter", true);
				var oSelectedObject = oParameters.rowContext.getObject();
				this._selectedObject = oSelectedObject;
			} else {
				oViewModel.setProperty("/showFooter", false);
			}
		},

		onDisplay: function(oEvent) {
			// // @type sap.ui.table.TreeTable
			// var oTreeTable = this.byId("treeTable");

			if (!this._selectedObject) {
				return;
			}

			switch (this._selectedObject.Type) {
				case "Cost Center Group":
					this.getRouter().navTo("cost-center-group", {
						costCenterGroup: this._selectedObject.Id
					});
					break;
				case "Cost Center":
					this.getRouter().navTo("cost-center", {
						costCenter: this._selectedObject.Id,
						costCenterGroup: this._selectedObject.ParentId
					});
					break;
				default:
			}
		},
		
		onRangeSliderChange: function(oEvent) {
			this.setRangeSliderColors(oEvent.getSource());
		},

		onCheckBoxSelectVariance: function(oEvent) {
			if (oEvent.getSource().getSelected()) {
				this.setRangeSliderColors(this.byId("slider_variance"));
			} else {
				this.unsetRangeSliderColors(this.byId("slider_variance"));
			}
		},

		onCheckBoxSelectYtd: function(oEvent) {
			if (oEvent.getSource().getSelected()) {
				this.setRangeSliderColors(this.byId("slider_ytd"));
			} else {
				this.unsetRangeSliderColors(this.byId("slider_ytd"));
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_createFilterModel: function(oEvent) {
			var oFilterModel = new JSONModel(this._filters);
			this.setModel(oFilterModel, "filters");
		},

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(oItem) {
			this.getRouter().navTo("cost-center-group", {
				costCenterGroup: oItem.getBindingContext().getProperty("Id")
			});
		}

	});
});