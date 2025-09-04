import {ActionIcon, CopyButton as MantineCopy, rem, Tooltip} from '@mantine/core';
import {IconCheck, IconCopy} from '@tabler/icons-react';
 

interface CopyButtonProps {
    value: string;
}

export const CopyButton = ({value}: CopyButtonProps) => {
    return (
        <MantineCopy value={value} timeout={2000}>
            {({copied, copy}) => (
                <Tooltip label={copied ? `Copied` : `Copy`} withArrow position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                        {copied ? (
                            <IconCheck style={{width: rem(16)}}/>
                        ) : (
                            <IconCopy style={{width: rem(16)}}/>
                        )}
                    </ActionIcon>
                </Tooltip>
            )}
        </MantineCopy>
    );
}