"use strict";

module.exports = {
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
			PrivateIpAddresses: [{ Primary: true, PrivateIpAddress: "10.0.28.166" }],
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
			PrivateIpAddresses: [{ Primary: true, PrivateIpAddress: "10.0.17.99" }],
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
