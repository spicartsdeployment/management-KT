"use client";

import * as React from "react";
import { cn } from "./utils";
import "../../../Assets/styles/Table.scss";

function Table({ className, ...props }) {
    return (
        <div
            data-slot="table-container"
            className="table-container"
        >
            <table
                data-slot="table"
                className={cn("table", className)}
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, ...props }) {
    return (
        <thead
            data-slot="table-header"
            className={cn("table__header", className)}
            {...props}
        />
    );
}

function TableBody({ className, ...props }) {
    return (
        <tbody
            data-slot="table-body"
            className={cn("table__body", className)}
            {...props}
        />
    );
}

function TableFooter({ className, ...props }) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn("table__footer", className)}
            {...props}
        />
    );
}

function TableRow({ className, ...props }) {
    return (
        <tr
            data-slot="table-row"
            className={cn("table__row", className)}
            {...props}
        />
    );
}

function TableHead({ className, ...props }) {
    return (
        <th
            data-slot="table-head"
            className={cn("table__head", className)}
            {...props}
        />
    );
}

function TableCell({ className, ...props }) {
    return (
        <td
            data-slot="table-cell"
            className={cn("table__cell", className)}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }) {
    return (
        <caption
            data-slot="table-caption"
            className={cn("table__caption", className)}
            {...props}
        />
    );
}

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
};