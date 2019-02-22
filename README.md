TechEmpower Benchmarks / AWS CDK
===

Uses the [AWS Cloud Development Kit (CDK)](https://awslabs.github.io/aws-cdk/) 
to deploy a simple compute fleet for running the 
[TechEmpower Web Framework Benchmarks](https://www.techempower.com/benchmarks/#section=intro)
on [AWS](https://aws.amazon.com).


## Architecture

`stub`


## Usage

This codebase was written in a **Node.js v8.11+** environment.
Should still work on any version above that, as long as the 
[AWS CDK requirements](https://github.com/awslabs/aws-cdk#getting-started)
matches somehow. 

> Note that the AWS CDK is still in _developer preview release_, 
> and will likely introduce breaking changes up until it releases formally.

### Installing and Configuring the AWS CDK

> More detailed instructions [here](https://docs.aws.amazon.com/CDK/latest/userguide/install_config.html).

1. Install the AWS CDK.

```
npm i -g aws-cdk
```

2. Feed your AWS credentials into the CDK. If you've got the [AWS CLI](https://aws.amazon.com/cli/)
   configured on your machine, you're most likely good to go.


### Setting up the codebase

1. Clone the repository.
2. `npm i`
3. Copy `.env.defaults` onto just `.env`. Reasonable defaults are already plugged in,
   but feel free to change things up.
4. You will need a keypair to use for `ssh`-ing onto the controller instance.
   You can create one on your [EC2 console](https://console.aws.amazon.com/ec2/v2/home?#KeyPairs:sort=keyName),
   or your can use one you already have.
   Make sure the value of `TEB_TESTCONTROLLER_KEYNAME` matches your keypair.
4. `npm run build`. This parses the Typescript files into JS, and prepares for CFN deployment.
5. `cdk deploy` will parse everything into CFN templates, and provision resources on AWS.


### Running tests

The controller instance serves as your testbed's control plane, and instructs the
other instances (client, server, database) to perform the necessary actions to 
run and catalog the tests. You generally won't need to go into any of the instances
except the controller. As such, **only your controller instance will have a public IPv4 address**.

```
ssh -i <your keypair> ec2-user@<controller public IP>
```

Once inside, the benchmark scripts will be in `/home/ec2-user/FrameworkBenchmarks`.
There will be a `tfb` script you can run to execute the tests.
Make sure to plug in the **private** IPv4 addresses into the script invocation:

> More info on how to run the tests are [here](https://frameworkbenchmarks.readthedocs.io/en/latest/Development/Installation-Guide/#explanation-of-the-tfb-script).

```
cd FrameworkBenchmarks
./tfb \
  --network-mode host \
  --client-host <client private IP> \
  --server-host <server private IP> \
  --database-host <database private IP>
```

Once the tests are done, you should have the results cataloged in `./results`.