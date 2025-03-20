import {FC, HTMLAttributes} from 'react';
import Image from "next/image";
import {createAvatar} from '@dicebear/core';
import {rings} from "@dicebear/collection";

interface IAvatarProps extends HTMLAttributes<HTMLImageElement> {
    seed: string;
}

const Avatar: FC<IAvatarProps> = ({seed, ...restProps}) => {

    const avatar = createAvatar(rings, {
        seed
    })

    const svg = avatar.toDataUri();

    return (
        <Image
            src={svg}
            alt="Avatar"
            width={100}
            height={100}
            {...restProps}
        />
    );
};

export default Avatar;
