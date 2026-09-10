import * as React from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MoreHorizontalIcon,
} from "lucide-react";

import { Button, buttonVariants } from "./button";
import "./../../Assets/styles/Pagination.scss";

function Pagination({ className, ...props }) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={["pagination", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function PaginationContent({ className, ...props }) {
    return (
        <ul
            data-slot="pagination-content"
            className={["pagination__content", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function PaginationItem({ ...props }) {
    return <li data-slot="pagination-item" {...props} />;
}

function PaginationLink({ className, isActive, size = "icon", ...props }) {
    return (
        <a
            aria-current={isActive ? "page" : undefined}
            data-slot="pagination-link"
            data-active={isActive}
            className={[
                "pagination__link",
                isActive ? "pagination__link--active" : "pagination__link--ghost",
                size === "icon" ? "pagination__link--icon" : "pagination__link--default",
                className,
            ].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function PaginationPrevious({ className, ...props }) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="default"
            className={["pagination__prev", className].filter(Boolean).join(" ")}
            {...props}
        >
            <ChevronLeftIcon />
            <span className="pagination__label">Previous</span>
        </PaginationLink>
    );
}

function PaginationNext({ className, ...props }) {
    return (
        <PaginationLink
            aria-label="Go to next page"
            size="default"
            className={["pagination__next", className].filter(Boolean).join(" ")}
            {...props}
        >
            <span className="pagination__label">Next</span>
            <ChevronRightIcon />
        </PaginationLink>
    );
}

function PaginationEllipsis({ className, ...props }) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={["pagination__ellipsis", className].filter(Boolean).join(" ")}
            {...props}
        >
            <MoreHorizontalIcon className="pagination__ellipsis-icon" />
            <span className="pagination__sr-only">More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
};