import React, {FC} from 'react';
import {IPageChildren} from "@typess/Common.type";
import {Header, Sidebar} from "@/components";

const AdminLayout: FC<IPageChildren> = ({children}) => {
    return (
        <div className="flex flex-col flex-[1]">
            <Header/>
            <div className="flex flex-col flex-[1] lg:flex-row bg-gray-100">
            <Sidebar/>
                <div className="flex-[1] flex justify-center lg:justify-start items-start max-w-5xl mx-auto w-full">{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;
