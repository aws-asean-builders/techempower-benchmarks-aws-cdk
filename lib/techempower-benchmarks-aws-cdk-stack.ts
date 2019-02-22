import { App, Stack, StackProps } from '@aws-cdk/cdk'

import createVpc from './resources/vpc'
import createSecurityGroup from './resources/securitygroup'
import { createTestMemberInstance, createTestControllerInstance } from './resources/ec2'

export class TechempowerBenchmarksAwsCdkStack extends Stack {
  constructor (scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = createVpc(this)
    const sg = createSecurityGroup(this, vpc)

    // :: grab the corresponding subnets used for the testbed
    const privateSubnet = vpc.privateSubnets[0]
    const publicSubnet = vpc.publicSubnets[0]

    createTestMemberInstance(this, sg, privateSubnet, 'test01')
    createTestMemberInstance(this, sg, privateSubnet, 'test02')
    createTestMemberInstance(this, sg, privateSubnet, 'test03')

    createTestControllerInstance(this, sg, publicSubnet, 'controller')
  }
}
