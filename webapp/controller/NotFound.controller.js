sap.ui.define([
		"festo/co/costcenteralert/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("festo.co.costcenteralert.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);