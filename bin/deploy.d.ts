/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export type SiteDeploy = {
    site: string;
    target?: string;
    url: string;
    expireTime: string;
};
export type ErrorResult = {
    status: "error";
    error: string;
};
export type ChannelSuccessResult = {
    status: "success";
    result: {
        [key: string]: SiteDeploy;
    };
};
export type ProductionSuccessResult = {
    status: "success";
    result: {
        hosting: string | string[];
    };
};
type DeployConfig = {
    projectId: string;
    target?: string;
    firebaseToolsVersion?: string;
    force?: boolean;
};
export type ChannelDeployConfig = DeployConfig & {
    expires: string;
    channelId: string;
    force?: boolean;
};
export type ProductionDeployConfig = DeployConfig & {
    force?: boolean;
};
export declare function interpretChannelDeployResult(deployResult: ChannelSuccessResult): {
    expireTime: string;
    expire_time_formatted: string;
    urls: string[];
};
export declare function deployPreview(gacFilename: string, deployConfig: ChannelDeployConfig): Promise<ErrorResult | ChannelSuccessResult>;
export declare function deployProductionSite(gacFilename: any, productionDeployConfig: ProductionDeployConfig): Promise<ErrorResult | ProductionSuccessResult>;
export {};
