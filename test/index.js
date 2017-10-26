"use strict";

const noop       = require("es5-ext/function/noop")
    , proxyquire = require("proxyquire")
    , sinon      = require("sinon")
    , test       = require("tape")
    , Plugin     = proxyquire("../", { "aws-sdk/clients/ec2": require("./__ec2-mock") });

test("Serverless Plugin VPC ENI Cleanup", t => {
	const serverlessMock = {
		cli: { log: noop },
		service: {
			functions: { foo: { name: "foo" } },
			provider: { region: "eu-west-1" }
		}
	};

	t.test("Success run", t => {
		const plugin = new Plugin(serverlessMock);
		plugin.cleanupInterval = 0;
		const { ec2 } = plugin;

		sinon.spy(ec2, "describeNetworkInterfaces");
		sinon.spy(ec2, "detachNetworkInterface");
		sinon.spy(ec2, "deleteNetworkInterface");

		plugin.cleanup();

		ec2.once("done", () => {
			plugin.hooks["after:remove:remove"]();
			plugin.cleanup(); // Confirm noop call (important for full coverage)
			t.equal(
				ec2.describeNetworkInterfaces.callCount,
				3,
				"Retrieves network interfaces repeatedly"
			);
			t.equal(
				ec2.detachNetworkInterface.callCount,
				1,
				"Detaches network interface if attached"
			);
			t.equal(ec2.deleteNetworkInterface.callCount, 4, "Deletes existing network interfaces");
			t.end();
		});
	});

	t.test("Error run", t => {
		const plugin = new Plugin(serverlessMock);
		plugin.cleanupInterval = 0;
		plugin.ec2.errors = [new Error("Unknown error")];

		sinon.spy(plugin, "handleError");

		plugin.cleanup();

		setTimeout(() => {
			t.equal(
				plugin.handleError.callCount,
				1,
				"Handles gently eventual not expected AWS SDK errors"
			);
			t.end();
		}, 100);
	});
	t.end();
});
