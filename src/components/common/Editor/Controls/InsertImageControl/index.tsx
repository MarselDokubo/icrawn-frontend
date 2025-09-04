import {RichTextEditor, useRichTextEditorContext} from "@mantine/tiptap";
import {useState} from "react";
 
import {IconPhotoPlus} from "@tabler/icons-react";
import {Button, FileButton, Group, Image, Loader, Modal, Portal, Stack, Tabs, Text, TextInput} from "@mantine/core";
import {useUploadImage} from "../../../../../mutations/useUploadImage.ts";

export const InsertImageControl = () => {
    const editor = useRichTextEditorContext();
    const [isModalOpen, setModalOpen] = useState(false);
    const [tab, setTab] = useState<string>('url');
    const [imageUrl, setImageUrl] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [urlError, setUrlError] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const uploadMutation = useUploadImage();

    const checkImageExists = (url: string) => {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img') as HTMLImageElement;
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
            img.src = url;
        });
    };

    const handleImageInsert = async () => {
        setLoading(true);
        try {
            const finalUrl = uploadedImageUrl || imageUrl;
            if (!finalUrl) {
                setUrlError(`Please provide an image.`);
                return;
            }
            await checkImageExists(finalUrl);
            if (editor) {
                editor.editor!.commands.setImage({src: finalUrl});
            }
            setModalOpen(false);
            resetState();
        } catch (error) {
            console.log(error)
            setUrlError(`Please enter a valid image URL that points to an image.`);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!file) {
            setUploadError(`Please select an image.`);
            return;
        }
        setIsUploading(true);
        setUploadError(null);
        uploadMutation.mutate({image: file}, {
            onSuccess: ({data}) => {
                setUploadedImageUrl(data.url);
                setUploadError(null);
                setIsUploading(false);
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message ?? `Failed to upload image.`;
                setUploadError(message);
                setIsUploading(false);
            }
        });
    };

    const resetState = () => {
        setTab('url');
        setImageUrl('');
        setUploadedImageUrl('');
        setUrlError(null);
        setUploadError(null);
        setIsUploading(false);
    };

    return (
        <>
            <RichTextEditor.Control
                onClick={() => setModalOpen(true)}
                aria-label="Insert image"
                title="Insert image"
            >
                <IconPhotoPlus stroke={1.5} size="1rem"/>
            </RichTextEditor.Control>

            <Portal>
                <Modal
                    opened={isModalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        resetState();
                    }}
                    title={`Insert Image`}
                >
                    <Tabs value={tab} onChange={setTab} variant="outline">
                        <Tabs.List grow>
                            <Tabs.Tab value="url">{`Paste URL`}</Tabs.Tab>
                            <Tabs.Tab value="upload">{`Upload Image`}</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="url" pt="md">
                            <Stack>
                                <TextInput
                                    label={`Image URL`}
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(event) => {
                                        setImageUrl(event.currentTarget.value);
                                        setUrlError(null);
                                    }}
                                    error={urlError}
                                />
                                <Button onClick={handleImageInsert} loading={loading}>
                                    {`Insert Image`}
                                </Button>
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="upload" pt="md">
                            <Stack>
                                {isUploading ? (
                                    <Stack align="center" py="xl">
                                        <Loader size="lg" />
                                        <Text size="sm" c="dimmed">
                                            {`Uploading image...`}
                                        </Text>
                                    </Stack>
                                ) : uploadedImageUrl ? (
                                    <>
                                        <Image
                                            src={uploadedImageUrl}
                                            alt="Uploaded preview"
                                            radius="md"
                                        />
                                        <Group grow>
                                            <Button onClick={handleImageInsert} loading={loading}>
                                                {`Insert Image`}
                                            </Button>
                                            <Button variant="outline" color="red" onClick={resetState}>
                                                {`Remove`}
                                            </Button>
                                        </Group>
                                    </>
                                ) : (
                                    <>
                                        <FileButton onChange={(file: File | null) => {
                                            setUploadError(null);
                                            file && handleFileUpload(file);
                                        }} accept="image/*">
                                            {(props) => (
                                                <Button {...props} variant="outline">
                                                    {`Upload Image`}
                                                </Button>
                                            )}
                                        </FileButton>
                                        {uploadError && (
                                            <Text c="red" size="sm">
                                                {uploadError}
                                            </Text>
                                        )}
                                    </>
                                )}
                            </Stack>
                        </Tabs.Panel>
                    </Tabs>
                </Modal>
            </Portal>
        </>
    );
};
