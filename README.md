[![Build status][circleci-image]][circleci-url]
[![Build status][appveyor-image]][appveyor-url]
[![Tests coverage][codecov-image]][codecov-url]
![Transpilation status][transpilation-image]
[![npm version][npm-image]][npm-url]

# serverless-plugin-vpc-eni-cleanup
## Cleanup of VPC network interfaces on stage removal

Removal of stage (so CloudFormation stack deletion) that involves VPC lambda functions is very slow.  
_"Waiting for NetworkInterfaces associated with the Lambda Function to be cleaned up"_ process takes usually around 40 minutes.

While the AWS team works on improving that, the workaround for a meantime is to remove those interfaces manually, so stack deletion finalizes in reasonable time.

This plugin removes all detected network interfaces in parallel to stack deletion process.

### Installation

```bash
npm install serverless-plugin-vpc-eni-cleanup
```

### Configuration

Activate plugin in `serverless.yml`

```yaml
plugins:
 - serverless-plugin-vpc-eni-cleanup
```

Following IAM policy needs to be ensured for plugin to work without issues

```json
{
  "Effect": "Allow",
  "Action": [
    "ec2:DeleteNetworkInterface",
    "ec2:DetachNetworkInterface",
    "ec2:DescribeNetworkInterfaces"
  ],
  "Resource": [
    "*"
  ]
}
```

That's it. Having that, with every `sls remove` operation plugin will attempt to delete discovered network interfaces

### Tests

```bash
npm test
```

[circleci-image]: https://img.shields.io/circleci/project/github/medikoo/serverless-plugin-vpc-eni-cleanup.svg
[circleci-url]: https://circleci.com/gh/medikoo/serverless-plugin-vpc-eni-cleanup
[appveyor-image]: https://img.shields.io/appveyor/ci/medikoo/serverless-plugin-vpc-eni-cleanup.svg
[appveyor-url]: https://ci.appveyor.com/project/medikoo/serverless-plugin-vpc-eni-cleanup
[codecov-image]: https://img.shields.io/codecov/c/github/medikoo/serverless-plugin-vpc-eni-cleanup.svg
[codecov-url]: https://codecov.io/gh/medikoo/serverless-plugin-vpc-eni-cleanup
[transpilation-image]: https://img.shields.io/badge/transpilation-free-brightgreen.svg
[npm-image]: https://img.shields.io/npm/v/serverless-plugin-vpc-eni-cleanup.svg
[npm-url]: https://www.npmjs.com/package/serverless-plugin-vpc-eni-cleanup
