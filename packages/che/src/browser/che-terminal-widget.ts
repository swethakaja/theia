/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TerminalWidget, TerminalWidgetFactoryOptions } from '@theia/terminal/lib/browser/terminal-widget';

export const CHE_TERMINAL_WIDGET_FACTORY_ID = 'che_terminal';

export const CheTerminalWidgetOptions = Symbol("CheTerminalWidgetOptions");
export interface CheTerminalWidgetOptions {
    id: string,
    caption: string,
    label: string
    destroyTermOnClose: boolean
}

export interface CheTerminalWidgetFactoryOptions extends TerminalWidgetFactoryOptions {
}

export class CheTerminalWidget extends TerminalWidget {

    protected async attachTerminal(id: number): Promise<number | undefined> {
        return id;
    }

    protected connectTerminalProcess(): void {
        const ws = new WebSocket('ws://172.17.0.1:32812/attach/' + this.terminalId);
        ws.onmessage = ({ data }) => {
            this.term.write(data);
        };
    }
}
