#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import "dotenv/config";

import { PlatformStack } from "../lib/platform-stack";

const app = new App();
new PlatformStack(app, "PlatformStack");
