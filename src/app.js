import './assets/style.css'; 

async function addSticky() {
    const stickyNote = await miro.board.createStickyNote({
        content: 'Hello, World!', 
    }); 
    
    await miro.board.viewport.zoomTo(stickyNote); 
} 

addSticky(); 
