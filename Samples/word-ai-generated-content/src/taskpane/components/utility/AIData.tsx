/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import axios, { AxiosRequestConfig } from "axios";
import { message } from "antd";

export const dropdownMenus = {
  title: [
    {
      desc: "Add a predefined title",
      key: "titlePredefined",
    },
    {
      type: "divider",
    },
    {
      desc: "Add a title generated by AI",
      key: "titleAI",
    },
  ],
  comment: [
    {
      desc: "Add a predefined comment",
      key: "commentPredefined",
    },
    {
      type: "divider",
    },
    {
      desc: "Add a comment generated by AI",
      key: "commentAI",
    },
  ],
  citation: [
    {
      desc: "Add a predefined citation",
      key: "citationPredefined",
    },
    {
      type: "divider",
    },
    {
      desc: "Add a citation generated by AI",
      key: "citationAI",
    },
  ],
};

export interface AzureTextGenAPI {
  prompt: string;
  max_tokens: number;
}

export interface AzureTextGenItem {
  text: string;
  finish_reason: string;
  logprobs: any;
}

export interface AzureTextGenRes {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: AzureTextGenItem[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const generateText = async (
  apiKey: string,
  endpoint: string,
  deployment: string,
  content: string,
  maxTokens: number = 1000
) => {
  let requestBody: AzureTextGenAPI = { prompt: content, max_tokens: maxTokens };
  let axiosConfig: AxiosRequestConfig = {
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    params: {
      "api-version": "2023-05-15",
    },
  };

  let url = endpoint + "/openai/deployments/" + deployment + "/completions";
  const res = await axios.post(url, requestBody, axiosConfig);

  if (res.status == 200 && res.data != null) {
    let resObj: AzureTextGenRes = res.data;
    if (resObj.choices == null || resObj.choices.length == 0) {
      message.error("get no choices from the azure service.");
    }
    return resObj.choices[0].text.replace("\n\r\n", "").replace("\n", "").replace("\n", "");
  } else {
    throw Error(res.data.error);
  }
};