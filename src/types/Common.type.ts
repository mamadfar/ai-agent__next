import {ReactNode} from "react";

export interface IPageChildren {
    children: ReactNode
}

export interface IPageParams<Param> {
    params: Promise<Param>
}