export default function ExportButton({ renderer }) {

    return(

        <button
        
        onClick={() => {

            if (!renderer.current) {
                console.error('no renderer instance found');
                return;
            }

            const dataUrl = renderer.current?.exportImage?.();
            if (!dataUrl) return;

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'film-emulation.png';
            link.click();
        }}
        className="export-btn"
        
        >Export</button>
    );


}