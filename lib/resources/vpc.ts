import { Stack } from '@aws-cdk/cdk'
import { SubnetType, VpcNetwork } from '@aws-cdk/aws-ec2'

export default function createVpc (
  stack: Stack,
  cidr: string = process.env.TEB_VPC_CIDR || '',
  name: string = 'appvpc'
): VpcNetwork {
  const vpc = new VpcNetwork(stack, name, {
    cidr,
    maxAZs: 1,
    natGateways: 1,
    natGatewayPlacement: { subnetName: 'control-plane' },

    // :: The testbed network really only needs one subnet,
    //    because all the instances involved in the loadtesting
    //    need to be in the same availability zone for the
    //    absolute minimal latency.
    //
    //    We'll add in another subnet to host our controller instance,
    //    largely so that we can keep the controller in a public subnet,
    //    and all other instances in private ones, but really,
    //    there is no requirement to have to use more than one AZ.
    //
    //    This will need to be adjusted if ever the option to
    //    test across AZs (or even regions!) is ever made available.
    subnetConfiguration: [
      {
        // cidrMask: 25,
        name: 'test-plane',
        subnetType:  SubnetType.Private
      },
      {
        // cidrMask: 25,
        name: 'control-plane',
        subnetType: SubnetType.Public
      }
    ]
  })

  return vpc
}
