import { readFileSync as read } from 'fs'
import { Stack } from '@aws-cdk/cdk'
import { AmazonLinuxImage, CfnInstance, SecurityGroup, IVpcSubnet, AmazonLinuxGeneration } from '@aws-cdk/aws-ec2'

// :: get a handle to the Amazon Linux 2 AMI
const ami = new AmazonLinuxImage({
  generation: AmazonLinuxGeneration.AmazonLinux2
})

export function createTestMemberInstance (
  stack: Stack,
  sg: SecurityGroup,
  subnet: IVpcSubnet,
  name: string
): CfnInstance {
  const instance = new CfnInstance(stack, name, {
    imageId: ami.getImage(stack).imageId,
    instanceType: process.env.TEB_TESTMEMBER_INSTANCETYPE,
    userData: read('./lib/userdata/testmember.sh').toString('base64'),

    networkInterfaces: [
      {
        deviceIndex: '0',
        associatePublicIpAddress: false,
        deleteOnTermination: true,
        subnetId: subnet.subnetId,
        groupSet: [sg.securityGroupId]
      }
    ]
  })

  return instance
}

export function createTestControllerInstance (
  stack: Stack,
  sg: SecurityGroup,
  subnet: IVpcSubnet,
  name: string
): CfnInstance {
  const instance = new CfnInstance(stack, name, {
    imageId: ami.getImage(stack).imageId,
    instanceType: process.env.TEB_TESTCONTROLLER_INSTANCETYPE,
    keyName: process.env.TEB_TESTCONTROLLER_KEYNAME,
    userData: read('./lib/userdata/controller.sh').toString('base64'),

    networkInterfaces: [
      {
        deviceIndex: '0',
        deleteOnTermination: true,
        subnetId: subnet.subnetId,
        groupSet: [sg.securityGroupId],

        // :: this will need a public IP address for SSH access
        associatePublicIpAddress: true
      }
    ]
  })

  return instance
}
