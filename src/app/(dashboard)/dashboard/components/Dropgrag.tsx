import React, { useState } from "react";

interface Item {
    id: number;
    content: string;
}

const DragAndDrop: React.FC = () => {
    const [items, setItems] = useState<Item[]>([
        { id: 1, content: "Item 1" },
        { id: 2, content: "Item 2" },
        { id: 3, content: "Item 3" },
    ]);

    console.log(items, "itemsitemsitems")

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        e.dataTransfer.setData("id", id.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: number) => {
        e.preventDefault();
        const draggedId = parseInt(e.dataTransfer.getData("id"), 10);

        if (draggedId === targetId) return;

        const draggedIndex = items.findIndex((item) => item.id === draggedId);
        const targetIndex = items.findIndex((item) => item.id === targetId);

        const updatedItems = [...items];
        const [draggedItem] = updatedItems.splice(draggedIndex, 1);
        updatedItems.splice(targetIndex, 0, draggedItem);

        setItems(updatedItems);
    };

    const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {items && items?.map((item) => (
                <div
                    key={item.id}
                    id={`item-${item.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={allowDrop}
                    onDrop={(e) => handleDrop(e, item.id)}
                    style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        backgroundColor: "#f9f9f9",
                        cursor: "grab",
                        textAlign: "center",
                    }}
                >
                    {item.content}
                </div>
            ))}
        </div>
    );
};

export default DragAndDrop;
