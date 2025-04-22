import './assets/style.css'; 

async function addSticky() {
    const stickyNote = await miro.board.createStickyNote({
        content: 'Hello, World!', 
    }); 
    
    await miro.board.viewport.zoomTo(stickyNote); 
} 

addSticky(); 

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

// Function to handle horizontal flip
async function handleHorizontalFlip() {
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
                x: image.x + 100, // Position to the right of original
                y: image.y,
                width: image.width, // Only specify width, height will be calculated automatically
            });
        }
    } catch (error) {
        console.error('Error flipping image:', error);
        await miro.board.notifications.showError('Error flipping image');
    }
}

// Function to handle vertical flip
async function handleVerticalFlip() {
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
                y: image.y + 100, // Position below the original
                width: image.width, // Only specify width, height will be calculated automatically
            });
        }
    } catch (error) {
        console.error('Error flipping image:', error);
        await miro.board.notifications.showError('Error flipping image');
    }
}

// Initialize the app
async function init() {
    // Add event listeners to buttons
    const horizontalButton = document.querySelector('button:first-of-type');
    const verticalButton = document.querySelector('button:last-of-type');
    
    horizontalButton.addEventListener('click', handleHorizontalFlip);
    verticalButton.addEventListener('click', handleVerticalFlip);
}

// Start the app
init(); 
