/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import { ProcessOptions } from '@theia/process/lib/node';
import { VariableResolverService } from '@theia/variable-resolver/lib/browser';
import { TaskResolver } from './task-contribution';
import { TaskConfiguration, ProcessTaskConfiguration } from '../common/task-protocol';

@injectable()
export class ProcessTaskResolver implements TaskResolver {

    @inject(VariableResolverService)
    protected readonly variableResolverService: VariableResolverService;

    /**
     * Perform some adjustments to the task launch configuration, before sending
     * it to the backend to be executed. We can make sure that parameters that
     * are optional to the user but required by the server will be defined, with
     * sane default values. Also, resolve all known variables, e.g. `${workspaceFolder}`.
     */
    async resolveTask(taskConfig: TaskConfiguration): Promise<TaskConfiguration> {
        if (taskConfig.type !== 'process' && taskConfig.type !== 'shell') {
            throw new Error('Unsupported task configuration type.');
        }
        const resultTask: ProcessTaskConfiguration = {
            type: taskConfig.type,
            label: taskConfig.label,
            processOptions: await this.resolveVariablesInOptions(taskConfig.processOptions),
            windows: taskConfig.windows ? await this.resolveVariablesInOptions(taskConfig.windows) : undefined,
            cwd: await this.variableResolverService.resolve(taskConfig.cwd ? taskConfig.cwd : '${workspaceFolder}')
        };
        return resultTask;
    }

    /** Resolve the variables in the given process options. */
    protected async resolveVariablesInOptions(options: ProcessOptions): Promise<ProcessOptions> {
        const resultOptions: ProcessOptions = {
            command: await this.variableResolverService.resolve(options.command),
            options: options.options
        };
        if (options.args) {
            resultOptions.args = await this.variableResolverService.resolveArray(options.args);
        }
        return resultOptions;
    }
}
