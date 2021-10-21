"use strict";

const remove             = require("es5-ext/array/#/remove")
    , copyDeep           = require("es5-ext/object/copy-deep")
    , optionalChaining   = require("es5-ext/optional-chaining")
    , d                  = require("d")
    , ee                 = require("event-emitter")
    , interfacesResponse = require("./interfaces-response");

const promiseWrap = fn => function (...args) { return { promise: () => fn.apply(this, args) }; };

class Ec2 {
	constructor() {
		this.interfaces = copyDeep(interfacesResponse);
		this.errors = [
			Object.assign(new Error("Network interface 'eni-96dfadba' is currently in use."), {
				code: "InvalidParameterValue"
			}),
			Object.assign(new Error("The networkInterface ID 'eni-3be29617' does not exist"), {
				code: "InvalidNetworkInterfaceID.NotFound"
			})
		];
	}
}
Object.defineProperties(ee(Ec2.prototype), {
	describeNetworkInterfaces: d(
		promiseWrap(function () {
			if (!this.interfaces.NetworkInterfaces.length) this.emit("done");
			return Promise.resolve(this.interfaces);
		})
	),
	detachNetworkInterface: d(
		promiseWrap(function (params) {
			if (
				this.interfaces.NetworkInterfaces.some(networkInterface => {
					if (
						optionalChaining(networkInterface.Attachment, "AttachmentId") ===
						params.AttachmentId
					) {
						delete networkInterface.Attachment;
						return true;
					}
					return false;
				})
			) {
				return Promise.resolve();
			}
			return Promise.reject(new Error("Unknown attachment id"));
		})
	),
	deleteNetworkInterface: d(
		promiseWrap(function (params) {
			const eni = this.interfaces.NetworkInterfaces.find(
				networkInterface =>
					networkInterface.NetworkInterfaceId === params.NetworkInterfaceId
			);
			if (!eni) return Promise.reject(new Error("Unknown interface id"));
			const error = this.errors.shift();
			if (error) return Promise.reject(error);
			remove.call(this.interfaces.NetworkInterfaces, eni);
			return Promise.resolve();
		})
	)
});

module.exports = Ec2;
