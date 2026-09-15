// Function to flip an image horizontally
async function flipImageHorizontally(imageData) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            // Flip horizontally
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0);
            
            // Get the flipped image as base64
            const flippedImageData = canvas.toDataURL('image/png');
            resolve(flippedImageData);
        };
        img.src = imageData;
    });
}

export async function init() {
    miro.board.ui.on('icon:click', async () => {
        try {
            // Get selected items
            const selectedItems = await miro.board.getSelection();
            
            // Filter for images only
            const selectedImages = selectedItems.filter(item => item.type === 'image');
            
            if (selectedImages.length === 0) {
                await miro.board.notifications.showInfo('Please select at least one image to flip');
                return;
            }

            // Process each selected image
            for (const image of selectedImages) {
                // Get the image data URL
                const imageDataUrl = await image.getDataUrl();
                
                // Flip the image horizontally
                const flippedImageData = await flipImageHorizontally(imageDataUrl);
                
                // Create the flipped image on the board
                await miro.board.createImage({
                    title: 'Flipped Image',
                    url: flippedImageData,
                    x: image.x + image.width + 20, // Position to the right of original with 20px padding
                    y: image.y,
                    width: image.width, // Only specify width, height will be calculated automatically
                });
            }
        } catch (error) {
            console.error('Error flipping image:', error);
            await miro.board.notifications.showError('Error flipping image');
        }
    });
}

init(); 