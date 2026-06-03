import html2canvas from 'html2canvas';
import './SaveTierlist2PngButton.css';


const SaveTierlist2PngButton = ({}) =>{
    const handleSaveAsImage = async () =>{
        const element = document.querySelector('#tierlist-result');
        const canvas = await html2canvas(element, {
        backgroundColor: '#12111a',
        scale:2,
        useCORS: true
    });
    console.log('hello')

    const link = document.createElement('a');
    link.download = 'tierlist-ergebnis-png';
    link.href = canvas.toDataURL('image/png');
    link.click();


    }
   

    return(
        <button onClick={handleSaveAsImage}>Speichern</button>
    )
}

export default SaveTierlist2PngButton;