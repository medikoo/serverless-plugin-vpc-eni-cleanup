"use strict";

const d           = require("d")
    , lazy        = require("d/lazy")
    , { inspect } = require("util");

const noopPromise = Promise.resolve();

class ServerlessPluginVpcEniCleanup {
	constructor(serverless) {
		this.serverless = serverless;
		this.provider = this.serverless.getProvider(this.serverless.service.provider.name);
		this.hooks = {
			"before:remove:remove": this.cleanup.bind(this),
			"after:remove:remove": () => (this.isDisabled = true)
		};
	}
	cleanup() {
		if (this.isDisabled) return;
		// Intentionally we do not return promise,
		// as we want to have polling done in parallel in the background
		Promise.all(
			this.functionNames.map(functionName =>
				this.provider
					.request("EC2", "describeNetworkInterfaces", {
						Filters: [
							{ Name: "requester-id", Values: [`*:${ functionName }`] },
							{ Name: "description", Values: ["AWS Lambda VPC ENI*"] }
						]
					})
					.then(
						result =>
							Promise.all(
								result.NetworkInterfaces.map(networkInterface =>
									this._deleteNetworkInterface(networkInterface, functionName)
								)
							),
						this.handleError.bind(this)
					)
			)
		).then(() => {
			if (this.isDisabled) return;
			setTimeout(this.cleanup.bind(this), this.cleanupInterval);
		});
	}
	_deleteNetworkInterface(networkInterface, functionName) {
		const interfaceId = networkInterface.NetworkInterfaceId;
		let detachmentPromise = noopPromise;
		if (networkInterface.Attachment) {
			detachmentPromise = this.provider.request("EC2", "detachNetworkInterface", {
				AttachmentId: networkInterface.Attachment.AttachmentId
			});
		}
		return detachmentPromise.then(
			() =>
				this.provider
					.request("EC2", "deleteNetworkInterface", { NetworkInterfaceId: interfaceId })
					.then(
						() =>
							this.serverless.cli.log(
								"VPC ENI Cleanup: " +
									`Deleted ${ interfaceId } ` +
									`ENI of ${ functionName } ` +
									"VPC function"
							),
						error => {
							if (error.code === "InvalidParameterValue") {
								// Network interface is currently in use
								// Skip on this error, as it may happen
								// few times for given interface
								return;
							}
							if (error.code === "InvalidNetworkInterfaceID.NotFound") {
								// Interface was already deleted
								return;
							}
							this.handleError(error);
						}
					),
			this.handleError.bind(this)
		);
	}
	handleError(error) {
		this.isDisabled = true;
		this.serverless.cli.log(`VPC ENI Cleanup: Error: ${ error.message }\n${ inspect(error) }`);
	}
}

Object.defineProperties(
	ServerlessPluginVpcEniCleanup.prototype,
	Object.assign(
		{
			isDisabled: d(false),
			cleanupInterval: d(5000) // Attempt ENI cleanup every 5 seconds
		},
		lazy({
			functionNames: d(function () {
				return Object.keys(this.serverless.service.functions).map(
					functionName => this.serverless.service.functions[functionName].name
				);
			})
		})
	)
);

module.exports = ServerlessPluginVpcEniCleanup;
