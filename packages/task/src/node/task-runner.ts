/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { Disposable } from '@theia/core/lib/common/disposable';
import { Task } from './task';
import { TaskConfiguration } from '../common/task-protocol';

export const TaskRunnerContribution = Symbol('TaskRunnerContribution');
/**
 * The Task Runner Contribution should be implemented to register custom Runners.
 */
export interface TaskRunnerContribution {
    registerRunner(runners: TaskRunnerRegistry): void;
}

export const TaskRunner = Symbol('TaskRunner');
export interface TaskRunner {
    run(options: TaskConfiguration, ctx?: string): Promise<Task>;
}

export const TaskRunnerRegistry = Symbol('TaskRunnerRegistry');
export interface TaskRunnerRegistry {
    registerRunner(type: string, runner: TaskRunner): Disposable;
    getRunner(type: string): TaskRunner | undefined;
}
