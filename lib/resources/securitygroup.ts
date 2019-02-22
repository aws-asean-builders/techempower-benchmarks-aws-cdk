import { Stack } from '@aws-cdk/cdk'
import { SecurityGroup, TcpAllPorts, VpcNetwork, TcpPort } from '@aws-cdk/aws-ec2'

function createSecurityGroup (
  stack: Stack,
  vpc: VpcNetwork,
  name: string = 'fleet-sg'
): SecurityGroup {
  const sg = new SecurityGroup(stack, name, {
    vpc,
    description: 'Allows comms between all members of the testbed fleet.',
    allowAllOutbound: true
  })

  // :: allow any member of this security group to talk
  //    to any other member
  sg.connections.allowInternally(new TcpAllPorts(), 'Allow members comms to other members of the security group.')

  // :: TODO only give this privilege to the controller instance
  // :: allow SSH access
  sg.connections.allowFromAnyIPv4(new TcpPort(22), 'Allows SSH access.')

  return sg
}

export default createSecurityGroup
