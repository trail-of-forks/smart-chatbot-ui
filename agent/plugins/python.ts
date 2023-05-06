import { Action, Plugin } from '@/types/agent';

import { TaskExecutionContext } from './executor';

export default {
  nameForModel: 'python_interpreter',
  nameForHuman: 'Python Interpreter',
  descriptionForHuman: 'You can run python code here.',
  descriptionForModel: `The tool for running python code. The text output to stdout by the program code will be return as as result of this tool. So program should print the results always. If the program is for create an image, write the image to working directory as png file. You can use the third party packages contained in this list ['numpy', 'pandas', 'matprotlib', 'opencv-python', 'requests']. This tool accept the json format input with the property 'code' only. 'code' property contains the python code to be executed. ex. {"code": "print('hello')"}. The code should be a valid python code. The code should print the results always. The code should not contain any infinite loops. The code should not contain any input statements. When the image urls are returned as results, the image should be displayed using markdown notation.`,
  displayForUser: true,
  execute: async (
    context: TaskExecutionContext,
    action: Action,
  ): Promise<string> => {
    const json = JSON.parse(action.pluginInput);
    const uri = 'http://localhost:8080/api/run';
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: json['code'] }),
    });
    const result = await response.json();
    return JSON.stringify(result);
  },
} as Plugin;
