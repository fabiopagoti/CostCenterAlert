jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"festo/co/costcenteralert/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"festo/co/costcenteralert/test/integration/pages/Worklist",
		"festo/co/costcenteralert/test/integration/pages/Object",
		"festo/co/costcenteralert/test/integration/pages/NotFound",
		"festo/co/costcenteralert/test/integration/pages/Browser",
		"festo/co/costcenteralert/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "festo.co.costcenteralert.view."
	});

	sap.ui.require([
		"festo/co/costcenteralert/test/integration/WorklistJourney",
		"festo/co/costcenteralert/test/integration/ObjectJourney",
		"festo/co/costcenteralert/test/integration/NavigationJourney",
		"festo/co/costcenteralert/test/integration/NotFoundJourney",
		"festo/co/costcenteralert/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});