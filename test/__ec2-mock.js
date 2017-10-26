"use strict";

const remove           = require("es5-ext/array/#/remove")
    , copyDeep         = require("es5-ext/object/copy-deep")
    , optionalChaining = require("es5-ext/optional-chaining")
    , d                = require("d")
    , ee               = require("event-emitter");

const interfacesResponse = {
	NetworkInterfaces: [
		{
			AvailabilityZone: "eu-west-1a",
			Description: "AWS Lambda VPC ENI: b6716958-204c-4451-914b-525c4635a42e",
			Groups: [
				{
					GroupName:
						"MaasTransportBookingInfrastructure-test-SecurityGroups-O59AAN0IUJXL" +
						"-LambdaSecurityGroup-1IZ3DS23KXZ48",
					GroupId: "sg-6a871112"
				}
			],
			InterfaceType: "interface",
			Ipv6Addresses: [],
			MacAddress: "02:3a:23:33:71:76",
			NetworkInterfaceId: "eni-cdbecfe1",
			OwnerId: "756207178743",
			PrivateIpAddress: "10.0.28.166",
			PrivateIpAddresses: [
				{
					Primary: true,
					PrivateIpAddress: "10.0.28.166"
				}
			],
			RequesterId: "AROAICRTBUNPTSPCFAZMO:maas-tsp-devmedikoo3-booking-citybikes",
			RequesterManaged: false,
			SourceDestCheck: true,
			Status: "available",
			SubnetId: "subnet-79a3251e",
			TagSet: [],
			VpcId: "vpc-6e3fb309"
		},
		{
			Attachment: {
				AttachTime: "2017-10-24T06:51:56.000Z",
				AttachmentId: "eni-attach-9246d473",
				DeleteOnTermination: false,
				DeviceIndex: 1,
				InstanceOwnerId: "aws-lambda",
				Status: "attached"
			},
			AvailabilityZone: "eu-west-1a",
			Description: "AWS Lambda VPC ENI: cd978655-5732-441a-9fba-91c2177c4c0b",
			Groups: [
				{
					GroupName:
						"MaasTransportBookingInfrastructure-test-SecurityGroups-O59AAN0IUJXL" +
						"-LambdaSecurityGroup-1IZ3DS23KXZ48",
					GroupId: "sg-6a871112"
				}
			],
			InterfaceType: "interface",
			Ipv6Addresses: [],
			MacAddress: "02:aa:a9:d1:7b:86",
			NetworkInterfaceId: "eni-96dfadba",
			OwnerId: "756207178743",
			PrivateIpAddress: "10.0.17.99",
			PrivateIpAddresses: [
				{
					Primary: true,
					PrivateIpAddress: "10.0.17.99"
				}
			],
			RequesterId: "AROAJTF57QRFPXULND6TC:maas-tsp-devmedikoo3-booking-citybikes",
			RequesterManaged: false,
			SourceDestCheck: true,
			Status: "in-use",
			SubnetId: "subnet-79a3251e",
			TagSet: [],
			VpcId: "vpc-6e3fb309"
		}
	]
};

const promiseWrap = fn =>
	function (...args) {
		return { promise: () => fn.apply(this, args) };
	};

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
