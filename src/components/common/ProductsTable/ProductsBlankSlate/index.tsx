import {NoResultsSplash} from "../../NoResultsSplash";
import {Button} from "../../Button";
import {IconPlus} from "@tabler/icons-react";
import {t, Trans} from "@lingui/macro";

interface ProductsBlankSlateProps {
    openCreateModal: (categoryId?: string) => void;
    productCategories: any;
    searchTerm: string;
}

export const ProductsBlankSlate = ({openCreateModal, productCategories, searchTerm}: ProductsBlankSlateProps) => {
    const showLargeBlankSlate = productCategories
        .every((category: any) => category.products.length === 0) && productCategories.length === 1;

    if (searchTerm) {
        return (
            <NoResultsSplash
                imageHref={'/blank-slate/tickets.svg'}
                heading={`No Search Results`}
                subHeading={(
                    <>
                        <p>
                            <>
                                We couldn't find any tickets matching {searchTerm ?
                                <strong>{searchTerm}</strong> : 'your search'}
                            </>
                        </p>
                    </>
                )}
            />
        );
    }

    if (showLargeBlankSlate) {
        return (
            <NoResultsSplash
                imageHref={'/blank-slate/tickets.svg'}
                heading={`No Products Ye`}
                subHeading={(
                    <>
                        <p>
                            {`You'll need at least one product to get started. Free, paid or let the user decide what to pay.`}
                        </p>
                        <Button
                            size={'xs'}
                            leftSection={<IconPlus/>}
                            color={'green'}
                            onClick={() => openCreateModal()}
                        >
                            {`Add Product to Category`}
                        </Button>
                    </>
                )}
            />
        );
    }

    return (
        <div style={{textAlign: 'center'}}><p style={{marginBottom: 20, marginTop: 0}}>
            {`This category doesn't have any products yet.`}
        </p>
            <Button
                size={'xs'}
                leftSection={<IconPlus/>}
                color={'green'}
                onClick={() => openCreateModal()}
            >{`Add Produc`}
            </Button>
        </div>
    )
}
