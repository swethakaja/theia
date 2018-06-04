/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import { TaskResolver } from '@theia/task/lib/browser';
import { TaskConfiguration } from '@theia/task/lib/common';
import { VariableResolverService } from '@theia/variable-resolver/lib/browser';
import { NpmTaskConfiguration } from '../common/task-protocol';

@injectable()
export class NpmTaskResolver implements TaskResolver {

    @inject(VariableResolverService)
    protected readonly variableResolverService: VariableResolverService;

    async resolveTask(taskConfig: TaskConfiguration): Promise<TaskConfiguration> {
        if (taskConfig.type !== 'npm') {
            throw new Error(`Unsupported task configuration type: ${taskConfig.type}`);
        }
        const resultTask: NpmTaskConfiguration = {
            type: taskConfig.type,
            label: taskConfig.label,
            script: taskConfig.script,
            processType: 'terminal',
            processOptions: {
                command: `npm`,
                args: ['run', taskConfig.script]
            },
            cwd: await this.variableResolverService.resolve(taskConfig.cwd ? taskConfig.cwd : '${workspaceFolder}')
        };
        return resultTask;
    }
}
