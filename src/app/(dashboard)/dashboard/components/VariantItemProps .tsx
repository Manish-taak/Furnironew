import DragDrop from "@/component/DragFiles";

interface VariantItemProps {
    variant: {
        id: string;
        combination: string;
        stock: number;
        price: number;
        sku: string;
    };
    updateVariantField: (id: string, field: string, value: any) => void;
    handleImageUpload: (id: string, files: FileList | null) => void;
}

const VariantItem: React.FC<VariantItemProps> = ({ variant, updateVariantField, handleImageUpload }) => {
    return (
        <div key={variant.id} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-100 flex flex-col items-start">
            <p className="font-medium mb-2">{variant.combination}</p>
            <label className="text-base text-gray-500 capitalize" htmlFor="stock">Stock</label>
            <input
                type="text"
                value={variant.stock}
                onChange={(e) => updateVariantField(variant.id, "stock", +e.target.value)}
                placeholder="Stock"
                className="block w-full mb-2 border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
            />
            <label className="text-base text-gray-500 capitalize" htmlFor="price">Price</label>
            <input
                type="text"
                value={variant.price}
                onChange={(e) => updateVariantField(variant.id, "price", +e.target.value)}
                placeholder="Price"
                className="block w-full mb-2 border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
            />
            <label className="text-base text-gray-500 capitalize" htmlFor="sku">SKU</label>
            <input
                type="text"
                value={variant.sku}
                onChange={(e) => updateVariantField(variant.id, "sku", e.target.value)}
                placeholder="SKU"
                className="block w-full mb-2 border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
            />
            <DragDrop onChange={(e) => handleImageUpload(variant.id, e.target.files)} />
        </div>
    );
};


export default VariantItem 