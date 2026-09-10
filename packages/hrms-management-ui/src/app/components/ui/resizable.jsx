"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import "./../../Assets/styles/Resizable.scss";

function ResizablePanelGroup({ className, ...props }) {
    return (
        <ResizablePrimitive.PanelGroup
            data-slot="resizable-panel-group"
            className={["resizable-group", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function ResizablePanel({ ...props }) {
    return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({ withHandle, className, ...props }) {
    return (
        <ResizablePrimitive.PanelResizeHandle
            data-slot="resizable-handle"
            className={["resizable-handle", className].filter(Boolean).join(" ")}
            {...props}
        >
            {withHandle && (
                <div className="resizable-handle__grip">
                    <GripVerticalIcon className="resizable-handle__grip-icon" />
                </div>
            )}
        </ResizablePrimitive.PanelResizeHandle>
    );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };