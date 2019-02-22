#!/usr/bin/env node
require('dotenv-defaults').config()

import 'source-map-support/register'
import cdk = require('@aws-cdk/cdk')
import { TechempowerBenchmarksAwsCdkStack } from '../lib/techempower-benchmarks-aws-cdk-stack'

const app = new cdk.App()
new TechempowerBenchmarksAwsCdkStack(app, 'TechempowerBenchmarksAwsCdkStack')
app.run()
