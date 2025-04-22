import './assets/style.css';

// Function to flip an image vertically
async function flipImageVertically(imageData) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            // Flip vertically
            ctx.translate(0, canvas.height);
            ctx.scale(1, -1);
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
                
                // Flip the image vertically
                const flippedImageData = await flipImageVertically(imageDataUrl);
                
                // Create the flipped image on the board
                await miro.board.createImage({
                    title: 'Flipped Image',
                    url: flippedImageData,
                    x: image.x,
                    y: image.y + image.height + 20, // Position below the original with 20px padding
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